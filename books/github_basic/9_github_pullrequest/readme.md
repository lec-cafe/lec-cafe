# GitHub PullRequestの活用

## GitHub Pull Requestの活用

GitHubにはPull Reuestと呼ばれるコードのマージ機能があります。

![](/images/4.pullrequest.png)

Pull Requestでは、コードのマージ前にコードの状態をチェックすることが可能で、
各種機能を用いて、コードの内容を確認することができます。

正しいPull Requestを作成できるよう、
自分でPull Requestを作成した際には、mergeを依頼する前に以下の各タブの情報を確認できるようにしておきましょう。

### タイトルとベース

Pull Requestのタイトルには、コードの変更内容がわかりやすいような記載を行います。

baseはPull Requestを投げる先と、投げる元の設定で、 Pull Requestの画面上では、
`into ... from ... ` の形式で表示されます。
ここの設定が間違っている場合、後述するcommitやdiffの欄がおかしくなるため注意しましょう。

Pull Requestの状態が未了で、まだマージされるべきでない場合タイトルに `WIP` と付与することで作業中であることを明記できます。

::: tip 
Pull Requestは未了の状態でもWIPの形式で早めに作成しておくようにしましょう。
ラフの状態でレビューを入れてもらうことで、作業内容の間違いや設計の方針ミスに早めに気づけたりします。
:::

### 概要欄

Pull Requestを作成する際に、概要を記述することが可能です。

まず概要欄には、関連するIssueの番号を明記するようにしましょう。
例えば1234番のIssueを完了させる作業を行っている場合には、
`close #1234` と記述します。

正しくIssue番号が記載できている場合、 `close` の下に破線が表示され、
マウスオーバーした際に、`this pullrequest close ...` のメッセージが表示されるようになります。

Pull Requstの内容が、 Issueを完了させない場合には、 `close` ではなく `ref #1234` のような形式で記述します。

その他概要欄には、レビュアーに向けてのコメントを記載します。
以下のようなものが備わっているとレビューがスムーズに進んで良いでしょう。

- 作業を行った上での、気付き、疑問点
- diffが発生している部分に対する注意書きなど
- レビューを行う上で必要なpreview urlや確認手順など

### Conversation 

コードに対するコメントが確認できるほか、CIなどの自動化ツールでの検証結果が確認できます。

CIで赤いバツが表示されている場合、何かの問題が発生しているケースがほとんどですので、
コードを修正して問題を解決するようにしましょう。

またコンフリクトが発生している場合にも、この画面からコンフリクトの存在を確認できます。
コンフリクトはWeb画面上からも解決できますが、エディタを用いた作業のほうがミスは少ないため、
極力手元でコレを解決してからPull Requestのマージ依頼を行うようにしましょう。

`upstream` の `dev` に対するPull Requestで、現在の `topic_2333` から作業を行っているとします。

コンフリクトを解決するには、`topic_2333` ブランチ上でベースをpullします。

```bash
$ git pull upstream dev
```

手元でコンフリクトが発生するため、修正を行い、 addしてコミットします。
作業内容が確認できたら `topic_2333` ブランチにpushしてPull Requestの画面が更新されていることを確認しましょう。

```bash
$ git push origin topic_2333
```

### Commits

Commitsの欄には、今回のPull Requestで作成されるCommitの一覧が表示されます。

ここに自分に身の覚えのないcommitが表示されている場合は、 baseの設定が間違っているか、
ブランチをきり間違えている可能性があります。

baseの修正で対応できない場合、無関係なブランチを起点として作業を開始してしまっている可能性がありますので、
以下の手順で、Pull Requestの作り直しが必要になります。

`upstream` の `dev` に対するPull Requestで、現在の `topic_2333` から作業を行っているとします。

まずは正しくブランチを切り直すためにbaseをfetchしてブランチを作成します。

```bash
$ git fetch upstream
$ git branch -b topci_2333_fix upstream/dev
```

上記の手順で `topci_2333_fix` が作成できますので、
ローカルの `topic_2333` 上にある作業状態をcheckoutコマンドで持ってきましょう。
`git status` でファイルの差分を確認しながら新しいコミットを実施することが可能です。

```bash
$ git checkout topic_2333
$ git status -s
$ git commit -am "commit messege"
```

作業内容が確認できたらpushして `topic_2333_fix` から新しいPull Requestを作成しましょう。

```bash
$ git push origin topic_2333_fix
```

### Files Changed

Files Changedの欄には、今回のPull Requestで変更されるファイルの一覧が表示されます。

ここに自分に身の覚えのないファイルの変更が表示されている場合は、作業内容が間違っている可能性があります。

見に覚えのない形でファイルが変更されてしまっている場合、以下の手順で修正することができます。

`upstream` の `dev` に対するPull Requestで、現在の `topic_2333` から作業を行っているとします。

まずはベースのブランチから最新情報を取得するため、baseのリポジトリをpullします。

```bash
$ git pull upstream dev
```

例えば、 `package-lock.json` に意図しない変更が入っている場合、以下の手順で変更を元に戻すことができます。

```bash
$ git checkout package-lock.json upstream/dev
```

手元で発生した変更を確認してcommitし `topic_2333` ブランチにpushして、
 Pull Requestの画面が更新されていることを確認しましょう。

```bash
$ git push origin topic_2333
```

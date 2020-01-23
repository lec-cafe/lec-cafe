# Gitを用いたチーム開発の形

Gitを用いることでチーム開発を行う場合、いくつかの方法があります。

## ブランチを用いた開発 - Git flow

Git flowはブランチを用いてリリースを管理する手法です。

Git flowの解説図としては、以下の記事に掲載されている図がよく用いられます。

https://qiita.com/KosukeSone/items/514dd24828b485c69a05

### Git flowとブランチ

Git flowでは、様々なブランチを用いてコードのリリース状態を管理します。

ブランチ名は一例ですが、主に以下のようなブランチが用いられます。

- `master` 本番環境でリリースされているブランチ
- `dev` staging環境でリリースされているブランチ
- `topic_xxxx` 現在開発中のタスクが積み上げられていくブランチ
- `hotfix` 開発中のラインとは別に緊急で本番環境に修正を加えるためのブランチ

Gitを使ったワークフローにおいて、プロジェクトで運用している特定の環境と、
Git上の状態を必ず一致させるというのは非常に重要です。

通常のプロジェクトでは、本番環境の他にテスト環境またはstaging環境と呼ばれる環境が用意されるため、
`master` `dev` といったブランチをこの環境と同期させるよう手配します。

ブランチの状態と環境のソースの状態を一致させるにはCDなどの活用がおすすめです。

### 開発作業のリリース

Git flowでは、staging環境にUPする前の開発用の作業場として、
開発ライン毎に `topic_xxxx` という形の開発ブランチが用意されます。

このような開発ブランチはtopicブランチ・featureブランチと呼ばれることが多く、
その開発ラインの機能名または、関連するissueの名称でブランチが切られることが多いでしょう。

topicブランチの内容は開発の終了タイミングでdevブランチなどの試験環境と結びつくブランチへとマージされ、
プロジェクトメンバーによるテストを経てmasterブランチにマージされ本番リリースとなります。

他のtopicブランチのリリースにより、
masterやdev等のメインとなるブランチが切り替わった場合は、
適宜topicブランチに最新の状態を取り込むためのmergeを実施する必要があります。

新しいtopicブランチをスタートする場合は通常はmasterブランチを起点にブランチを起こしますが、
現在devブランチにて試験中の機能に依存する開発を行う場合などはdevブランチをベースにブランチを立てる必要があります。

### 緊急な修正のリリース

開発中のtopicブランチやdevブランチの状態を無視して、
緊急でmasterブランチの状態を変更させる場合、
masterブランチを起点にhotfixブランチを立て、
hotfixブランチ上で修正を行いつつ、masterブランチにコードを反映します。

緊急修正の場合でも、topicブランチの変更と同様にmasterブランチ上に起こった修正は、
devやtopicブランチに対してマージされます。

### Git flowの問題点

Git flowはGitを用いた開発の手法としてはベーシックなものですが、
プロジェクトの規模が大きくなると次第に運用コストが大きくなります。

Git flowの欠点としては、主に以下のようなものが挙げられます。

- プロジェクト内に複数のブランチが乱立し、複雑化する
- 並行で進むtopicブランチが増えるほど、マージのコストが増大する

Git flowにおける管理コストの問題は、
GitHub flowを導入することで解決可能ですが、
GitHub flowを用いながら部分的にGit flowを導入する事も可能です。

## GitHubを用いた開発 - GitHub flow

GitHub flowはGitHubのPull Requestを用いてリリースを管理する手法です。

GitHub flowの解説図としては、以下の記事などが利用可能です。

https://gist.github.com/Gab-km/3705015

### GitHub flowとブランチ 

GitHub flowでは、プロジェクトのリリースの管理をシンプルにするため、
プロジェクト内で利用されるブランチを限りなく少なくします。

GitHub flowにおける必要なブランチは `master` のみの一本で、
このmasterブランチは、本番環境の状態と一致したものになります。

各種変更作業はメインのリポジトリからforkされたリポジトリから行われ、
変更は、 GitHubのPull Requestを通じてメインリポジトリのmasterにマージされます。

開発の便宜上で `dev` ブランチも用意し、 `dev` ブランチと `master` ブランチの2本でGitHub flowを運用するケースもあります。

### GitHub flowの運用

GitHub flowでは2つのリポジトリを利用します。

ここでは便宜上、メインのリポジトリをupstream、フォークしたリポジトリをoriginと呼ぶようにしましょう。

`git remote` コマンドを利用してupstreamとoriginの2つをリモートとして登録します。

リモートの登録状況は `git remote -v` で確認できます。

```bash
$ git remote -v 
origin  https://github.com/mikakane/lec-cafe (fetch)
origin  https://github.com/mikakane/lec-cafe (push)
upstream  https://github.com/lec-cafe/lec-cafe (fetch)
upstream  https://github.com/lec-cafe/lec-cafe (push)
```

GitHub flowで修正作業を行う場合には、毎回トピックブランチを自分のリポジトリ上に作成する必要があります。

トピックブランチを作成する際には、起点となるupstream上のブランチを確認する必要があります。
これはプロジェクトによって異なるため、必ず作業前に確認するようにしましょう。

まず、 起点となるupstream上のブランチの最新情報を取得するため、 `fetch` を行います。

```bash
$ git fetch upstream
```

次に起点となるブランチをベースに、手元でブランチを作成します。ここではupstreamの `dev` をベースに `topic_2333` を作成するものとします。

```bash
$ git checkout -b topic_2333 upstream/dev
```

ブランチが作成できたらブランチ上で修正作業を行います。
修正作業が終わったら自分のリポジトリoriginにpushして修正内容をGitHub上に送信します。

```bash
$ git push origin topic_2333
```

この状態では、フォークしたリポジトリにしか変更が反映されていないため、
最後にPull Requestを作成してupstreamにデータを送信します。
`upstream/dev` ← `origin/topic_2333` となるようにPull Requestの設定を調整し、
Pull RequestのDiffが予期した形になっているかを確認しましょう。

### GitHub flowとSqueash Merge

GitHub flowでは、様々な変更をForkしたリポジトリ上のtopicブランチで処理し、
個別にマージを実施するため、小さい単位での分業に耐えうるというメリットがあります。

マージが複数回実施されるケースでは、マージコミットが煩雑になりがちですが、
GitHubのPull Requestでは、Squash Mergeと呼ばれる機能が用意されており、
これを利用することでMerge Commitを作成することなく、Pull Request上のコミットを1つのコミットにまとめて処理することができます。


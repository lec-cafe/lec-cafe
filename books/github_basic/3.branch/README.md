---
permalink: /branch
---
# ブランチの活用

ブランチはGit上で複数のコミットの履歴を作成するための機能です。

ブランチを利用することで、様々なバージョンのコードの履歴を作成することができます。

## ブランチを作成する

先程までトップページの `index.html` を作成していたので、
お問い合わせページを作成するために、`contact` ブランチを作成してみましょう。

新しいブランチを作成する際は `git checkout` コマンドを利用します。

```bash
$ git checkout -b contact master
```

Git checkoutコマンドは `-b` オプションで作成するブランチ名を指定します。

また引数でブランチ作成の起点となるブランチ名を指定します。上記の例では `master` を指定しています。

::: tip
masterはリポジトリ作成時にデフォルトで用意されるブランチです。
:::

## ブランチを確認する

`git branch` コマンドは作成されたブランチと、現在のブランチを確認することができるコマンドです。

```bash
$ git branch 
  master
* contact
```

コマンドを実行すると、手元のリポジトリに存在するブランチの一覧が表示され、
現在のブランチの先頭に `*` 印が表示されます。

Gitリポジトリ上では、現在のブランチ、という概念が通常存在し、
コミットを作成した場合、そのコミットは現在のブランチ上に作成されます。


## ブランチ上でコミットを作成する

ブランチが作成できたら、 contact.htmlを作成して、コミットしてみましょう。

```bash
$ touch public/contact.html
$ git add public/contact.html
$ git commit -m "add contact page"
```

ブランチを作成したあとでコミットを行うと、コミットはその作成したブランチ上に作成されます。

現在contactブランチにいる場合、pushする際のコマンドも以下のようになります。

```bash
$ git push origin contact
```

これでGitHub上にもcontactブランチが作成されて、contact.htmlが記録されます。

::: Let's Try !
GitHub上にブランチを追加することができたら、NetlifyのBranch Deploy機能を試してみましょう。
:::


## ブランチを切り替える

checkoutコマンドを利用してブランチを切り替えることができます。

```bash
$ git checkout master
```

上記の様にコマンドを実行すると、現在のブランチがmasterブランチに切り替わります。

手元からcontact.htmlがなくなっているのが確認できるでしょう。

Gitのリポジトリではブランチ毎にコミットの記録を保持しているため、
ブランチを切り替えながら複数の機能を実装することができます。

ブランチ同士を合体させる作業を `マージ` といい、`merge` コマンドを用いてこれを行うことができます。

```bash
$ git merge contact
```

現在masterブランチにいる状態で上記のコマンドを実行すると、
`contact` ブランチの内容が `master` ブランチに取り込まれて 
手元にcontact.htmlが出来上がるのが確認できるでしょう。

## ブランチ同士の履歴を確認する

`git show-branch` は、Git同士のバージョンの違いを確認するためのコマンドです。

```bash
$ git show-branch 
```

`---` で挟んで上のエリアにブランチの一覧が表示され、
`---` よりも下の欄にはコミットの記録が表示されます。

`+` や `*` がブランチに該当のコミットが含まれていることを表しており、
空白になっている場合、そのブランチにはまだそのコミットが含まれていません。

`git show-branch` は、 `-a` オプションを付与することで、リモートリポジトリの内容も表示することができます。

```bash
$ git show-branch -a
```

## ブランチを削除する

不要になったブランチは削除する事ができます。

例えばmasterブランチにcontactブランチをmergeした場合、
contactブランチはもう不要になるため、 `branch` コマンドに `-d` オプションを付けてブランチを削除します。

```bash
$ git branch -d contact
```

`-d` オプションで削除可能なブランチは、
現在のブランチに取り込み済みのブランチのみです。

もしcontactブランチがmasterブランチにマージされていない場合、
`-D` オプションでcontactブランチを削除する形になります。

```bash
$ git branch -D contact
```

::: danger
`-D` オプションを用いた削除は、まだ取り込みが行われていないブランチも削除してしまうため、
ブランチの削除のご操作防止のためにも、基本的には `-d` を利用した削除を利用するべきです。
:::

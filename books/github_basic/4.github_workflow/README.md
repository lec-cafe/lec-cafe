---
permalink: /github_workflow
---
# GitHubを使ったワークフロー

## clone 

GitHubを利用することで、自身で作成したリポジトリだけでなく、
他人の作成したリポジトリも取得して、作業を開始することができます。

GitHub上のリポジトリから手元にリポジトリ環境を取得するには、
`git clone` コマンドを利用して以下の様に実行します。

```bash
$ git clone  https://github.com/lec-cafe/book_github_intro
```

::: warning
Gitリポジトリの中にGitリポジトリを作成すると、予期せぬ動作を招く可能性があります。

一旦 `cd ~` など行って、Gitリポジトリ外に移動してから上記のコマンドを実行しましょう。
:::


上記のコマンドを実行すると、現在のディレクトリに `book_github_intro` フォルダが作成されて、
このドキュメントのリポジトリ内容がダウンロードされます。

remoteに、すでにcloneした元のアドレスが登録されていることが確認できるでしょう。

```bash
$ cd book_github_intro
$ git remote -v
```

## リポジトリをForkする

cloneして作成したリポジトリは、自分で作成したリポジトリと同じ様に、
ファイルの変更内容をaddしてコミットを作成することができます。

しかし、ファイルの変更をコミットしても、`git push origin master` コマンドを実行すると、
エラーになることがわかるでしょう。

GitHubで作業を行うとき、リポジトリでコードが共有されていても、
そのリポジトリは読み取り専用で、コードの書き換えができないケースがほとんどです。

チームで自分専用の書き込み可能なリポジトリを作成する場合、
GitHubのFork機能を利用して、自分専用のリポジトリを作成してみましょう。

まずはForkを作成するために、以下のURLで元となるリポジトリを開いてみましょう。

https://github.com/lec-cafe/book_github_intro

右上にある `fork` のボタンをクリックするとForkが始まります。
URLが変化し、自分のGitHubアカウント名を含む形式に変化したのが確認できるでしょう。

Forkして作成したリポジトリは、元のリポジトリと同じコミット内容をもつリポジトリになります。

元の公開されているリポジトリは、他人の作成したリポジトリだったため、
勝手にコミット等を追加することはできませんでしたが、
Forkしたリポジトリは、内容は元のリポジトリのまま、
自分専用のリポジトリとして利用することができます。

GitでForkしたリポジトリにPushするため、
まずは手元のリポジトリに、remoteを追加します。

```bash
$ git remote add {任意のリモート名} {ForkしたリポジトリのURL} 
```

::: tip
remote addでリポジトリを追加したら、正しく登録ができているか、
`git remote -v` で確認してみましょう。
:::


Forkしたリポジトリが登録できたら、登録したリポジトリに向けてpushを行います。

```bash
$ git push {登録したリモート名} master
```

これでコードの変更をForkしたリポジトリに送信できました。

### Pull Requestの作成

Forkしたリポジトリにコミットを送信しても、自分のFork先リポジトリにコミットがあるだけで、
他の人と共同作業には役に立たないコードになっています。

Fork先にPushしたコミットを、元のリポジトリに取り込むには、
Pull Requestと呼ばれる機能を用いて、GitHub上で取込リクエストを送ることができます。

![](/images/4.pullrequest.png)

PullRequestを作成したら、commitや  Files changedのタブから、
自分の送信したPull Requestが送信したい内容の意図とあっているか必ず確認するようにしましょう。

### pullしてデータを取得する

`git pull` は、 `push` の反対で、リモートリポジトリからデータの変更を取り込みます。

他人のPull Request等で元のリポジトリに反映された変更を取り込むには、
`pull` コマンドを利用して以下のようにします。

```bash
$ git pull origin master
```

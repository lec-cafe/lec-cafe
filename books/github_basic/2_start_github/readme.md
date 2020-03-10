---
permalink: /start_github
---

# GitHubにコードをUPする

ターミナルの基本操作が理解できたところで、
実際にファイルを作成しながら、Gitの操作方法を体験してみましょう。

## Gitを利用する

Gitはコマンドベースで利用する、バージョン管理ツールです。

Gitでのバージョン管理は、任意のフォルダ単位で行われ、
1つのバージョン管理を行うフォルダを `リポジトリ` と呼びます。

リポジトリでは、ファイルの変更履歴を`コミット`と呼ばれる単位で管理します。

まずはリポジトリを作成して、最初のコミットを作成してみましょう。

### ファイルの準備

まずは、バージョン管理を行うために、1つフォルダを作成してみましょう。

ここではWeb制作のプロジェクトを想定して、
`website` というフォルダに `public` フォルダを作成して、
中に、 `index.html` を作成してみましょう。

```bash
$ mkdir website
$ mkdir website/public
$ touch website/public/index.html
```

これで現在のディレクトリに、 websiteフォルダが作成され、
publicフォルダとその中にindex.htmlが作成されているはずです。

### Gitリポジトリの作成

作成したwebsiteフォルダでバージョン管理を開始するには、
現在のディレクトリが `website` フォルダになるよう `cd` コマンドで移動し、
`git init` コマンドを実行します。

```bash
$ cd website
$ git init 
```

`git init` コマンドを実行することで、ディレクトリに `.git` フォルダが作成されます。
Gitのバージョン情報は全てこの `.git` フォルダに格納されます。

### コミットする

Gitのバージョン履歴は全て`コミット` と呼ばれる単位でリポジトリに保存されます。

Gitのリポジトリにコミットを追加するには、
まずファイルの情報を `ステージ（インデックス）` に登録し、コミットを行います。

ステージにファイルを登録するには `git add` コマンドを使用します。

```bash
$ git add public/index.html
```

addコマンドは引数に登録するファイル名を指定します。

ステージに登録したファイルの情報でコミットを作成してリポジトリに追加するには `git commit` コマンドを利用します。

```bash
$ git commit -m "add index.html"
```

commitコマンドは `-m` オプションでコミットコメントを指定することができます。

リポジトリに対するファイルの変更は全てコミットの単位で管理されますが、
このコミットに逐次コメントを付けておくことで、後から変更の履歴を振り返るときの参考になります。

## Githubを利用する

手元で作成したリポジトリにコミットをできたので、
次はGitHub上に作成したリポジトリにコミットを送信してみましょう。

手元に作成したリポジトリの内容をGitHub上のリポジトリに送信することで、
作成したコミットをWeb上で確認することやチームでの開発が可能になります。

### リポジトリを作成する

GitHubに空のリポジトリを作成するには、以下のURLからリポジトリ名を入力して登録を行います。

https://github.com/new

実際にリポジトリを作成して、GitHub上のリポジトリの画面を表示してみましょう。

### Githubのリポジトリを登録する

GitHubでリポジトリが作成できたら、
手元で作成したGitリポジトリに、 GitHubのリポジトリのURLを登録します。

`git remote` コマンドは、GitHubなどの外部で同期するリポジトリのURLを管理するためのコマンドです。

```bash
$ git remote add origin {GitHubのURL}
```

登録したリポジトリの一覧は `remote -v` コマンドで確認することができます。

```bash
$ git remote -v
```

### Githubにコミットを送信する

リモートが登録できたら、手元のリポジトリからGitHubのリポジトリに先程作成したコミットを送信してみましょう。

コミットをリモートリポジトリに送信するには `push` コマンドが利用可能です。

```bash
$ git push origin master
```

上記のコマンドを実行すると、GitHubにコミットが送信されます。
(送信前にUser名とPasswordが尋ねられる場合、GitHubのログイン情報を入力してください）

GitHubのWebページ上でかく作成したリポジトリを確認してみると、先程作成したコミットが追加されているのがわかるでしょう。

## 複数のコミットを追加する

次にファイルの変更を行って、コミットを複数追加してみましょう。

`public/index.html` をテキストエディタ等で開いて、以下のようなコードを記述してみましょう。

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>My Website</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

コードの変更をコミットとして登録するには、先ほどと同様に `add` してから `commit` します。

```bash
$ git add public/index.html
$ git commit -m "add html code"
```

コミットができたら、`push` してGitHubにコードを登録します。

```bash
$ git push origin master
```

::: TRY
[Netlify](/9_netlify) のページを確認しながらGitHubにUPされたコードをWebサイトとして公開してみましょう。
:::

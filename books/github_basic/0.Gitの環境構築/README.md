---
permalink: /introduction
---

# Gitの環境構築

Gitはソースコードなどの履歴を管理するためのバージョン管理システムと呼ばれるツールです。

複数人での開発など、現場での開発作業では、Gitなどのバージョン管理システムが用いられることがほとんどです。

まずは始めに、 Gitの操作を始めるための環境構築を進めてみましょう。

## Gitの環境構築

GitはPC上で利用するツールで、PCへのインストールが必要です。

MacとWindowsで手順が異なるため、それぞれ対象の手順を参考にしてください。

### Windows

Windowsの方はGit for WindowsをインストールしてGitの環境構築を行いましょう。

https://gitforwindows.org/

Git for Windowsをインストールすることで、ターミナルアプリのGit Bashもインストールされます。

スタート画面からGit Bashを探して起動することで、コマンド入力の画面を開くことができます。

### Mac 

Macの場合は標準のターミナルアプリから、Gitを利用することができます。

Gitがインストールされているか確認するために `git --version` コマンドを実行しましょう。

```bash
$ git --version
xcode-select: note: no developer tools were found at '/Applications/Xcode.app', requesting install. Choose an option in the dialog to download the command line developer tools.
```

上記のような表示でダイアログが表示された場合、まだMacにGitがインストールされていないため、
ダイアログの「インストール」を押してGitの導入を進めてください。

`git --version` を実行した際に以下のような表示でバージョン番号が表示されればGitのセットアップは完了です。

```bash
$ git --version
git version 2.21.0 (Apple Git-122)
```

## Gitの設定

Gitを利用する前に、Gitのユーザ設定が必要です。

Gitではバージョン履歴を記録する際に、ユーザ名とEmailアドレスが必要になります。 

現在のGitの設定状況は、 `git config -l` コマンドで確認できます。

```bash
$ git config -l
```

`user.email` や `user.name` の項目が表示されない場合は、ユーザ情報が未登録です。
 
各環境のターミナルアプリで以下のようなコマンドを実行して、
ユーザ名とEmailアドレスを登録しておきましょう。

```
$ git config --global user.name "hoge"
$ git config --global user.email "hoge@example.com"
```

::: tip
`hoge` となっている箇所は、適宜ユーザ名に変更してください。
emailとnameはGitHubで利用しているものと揃えておくと良いでしょう。
:::
 
## GitHubのアカウント作成

あわせて、GitHubのアカウント作成も行っておきましょう。

GitHubのサイトから `Sign up` を選択して、GitHubのアカウントを作成することが可能です。

https://github.com/

GitがPC上でバージョン管理を行うツールなのに対して、
GitHubはGitで管理したバージョン情報をWeb上で確認したり共有したりするためのツールです。


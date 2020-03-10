---
---

# Homesteadによる環境構築 

HomesteadはLaravelの提供するVagrant環境キットで、
Laravelを動作させるために必要なソフトウェアが一通りインストールされています。

Vagrantはローカル環境構築を行うためのツールで、
仮想環境を用いてPC上にLinux環境を構築することができます。

構築を進めるには以下よりVirtualboxとVagrantをインストールする必要があります。

https://www.virtualbox.org/wiki/Downloads

https://www.vagrantup.com/downloads.html

## Vagrantのセットアップ

まずは、以下のコマンドを実行してVagrantのboxファイルをダウンロードします。


```bash
$ vagrant box add laravel/homestead
```

::: tip
Vagrantのboxファイルダウンロードには、ネットワークの状況にもよりますが、
非常に時間がかかるケースがあります。
:::

ダウンロードを進めながら、Homesteadのプロジェクトテンプレートをダウンロードします。

```bash
$ git clone https://github.com/laravel/homestead.git ~/Homestead
```

ダウンロードできたら、作成された `Homestead` フォルダに移動して、 `release` ブランチをチェックアウトします。

```bash
$ cd ~/Homestead
$ git checkout release
```

最後に、セットアップのスクリプトを実行します。

Macの場合は、以下のようなコマンドで、

```bash
// Mac / Linux...
$ bash init.sh
```

Windowsの場合は、以下のようなコマンドになります。

```bash
// Windows...
$ init.bat
```

## Homesteadの設定

セットアップスクリプトを作成して、作成される `Homestead.yaml` は、
Homestead環境の設定ファイルです。

`folders` のセクションには、VagrantのShared Foldersの設定を記述するようになっており、
ローカルのPCパスと、Vagrant内の仮想環境のパスを同期させることができます。

```bash
folders:
    - map: ~/code
      to: /home/vagrant/code
```

上記のような設定の場合、 vagrant内の `/home/vagrant/code` とローカルの `~/code` フォルダとが同期され、
同じ内容のファイルが展開されるようになります。

ファイルを同期するために以下のコマンドで、同期用のフォルダを作成しておきましょう。

```bash
$ mkdir ~/code
```

## Vagrantの設定

Vagrant仮想環境を立ち上げるには、`Vagrantfile` のあるフォルダで、`vagrant up` コマンドを実行します。

```bash
$ vagrant up 
```

立ち上がったVagrant環境には `vagrant ssh` コマンドでログインすることができます。

```bash
$ vagrant ssh
```

::: tip
`vagrant ssh` で鍵関連のエラーが出る場合は、
`ssh-keygen -t rsa` コマンドを実行して鍵ファイルの作成を行ってください。
:::

::: tip
sshでログインするとコンソールの表示が `vagrant@` に切り替わります。
vagrantから抜けるには `exit` コマンドを実行します。
:::


作業が完了して仮想環境のリソースを開放する場合、 `vagrant halt` で仮想環境を停止させることができます。

```bash
$ vagrant halt
```

作成した仮想環境を完全に削除したい場合、 `vagrant destroy` コマンドを利用します。

```bash
$ vagrant destroy
```

## Laravel環境のセットアップ

Vagrant環境の用意ができたら、実際にLaravelのセットアップを進めていきましょう。

```bash
$ vagrant ssh 
```

cdでローカルとコード同期されている、 `code` フォルダまで移動して、
`laravel new` コマンドでLaravelの初期構成をセットアップします。

```
$ cd code
$ laravel new 
```

最後にブラウザで `http://homestead.test` または `http://192.168.10.10/` にアクセスしてLaravelの初期画面が表示されたらセットアップは完了です。

### ローカルのデータベースに接続する

デフォルトの構成では、 MySQLデータベースへの接続設定がセットアップされています。

MySQL Workbenchなどのツールを利用して、データベースの中身が見れるようにしておきましょう。

https://dev.mysql.com/downloads/workbench/

ツールがダウンロードできたら、以下の接続情報でVagrant内のデータベースに接続することができます。

- host : `127.0.0.1`
- port : `33060` 
- username : `homestead`
- password : `secret`

::: tip 
PostgreSQLを利用する場合はポート番号 `54320` を利用します。
ホスト名、ユーザ名、パスワードは同じものが利用可能です。
:::



参考

https://laravel.com/docs/6.x/homestead


---
permalink: /git_remote
---

# Git remote 

## リモートを管理する 

`git remote` はGitに登録されているリモートリポジトリの一覧を管理するためのコマンドです。

`-v` は登録されているリモートリポジトリの一覧を表示するためのコマンドです。

```bash
$ git remote -v
```

`remote add` コマンドは新しくリモートを登録します。引数にリモート名とリモートのURLを取ります。

```bash
$ git remote add {REMOTE_NAME} {REMOTE_URL}
```

`remote rm` コマンドはすでに追加されたリモートを削除します。引数に削除する対象のリモート名をとります。

```bash
$ git remote rm {TARGET_REMOTE_NAME}
```

`remote rename` コマンドはすでに追加されたリモートの名前を変更します。引数に名前を変更する対象のリモート名と新しいリモート名を取ります。

```bash
$ git remote rename {TARGET_REMOTE_NAME} {NEW_REMOTE_NAME}
```

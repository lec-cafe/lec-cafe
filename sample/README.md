## サンプルコードの追加方法

sample をコピーして資料を作成。

lec cafe の組織にアクセスしてリポジトリを作成

https://github.com/lec-cafe

- リポジトリ名は、`sample_` 接頭辞で作成する。

sample のフォルダにアクセスして、git init からリポジトリを有効化。

git push してリポジトリにデータを登録する。

push し終わったら フォルダ名を .bak にして移動

submodule コマンドを使ってリポジトリからデータを再取得する。

```bash
$ git submodule add https://github.com/lec-cafe/sample_nuxtjs_firebase sample/nuxtjs_firebase
```

同じものが取れてきたら .bak を削除

## Netlify の接続

そのまま Github と連携してデプロイ

アプリ名は、 `books-nuxtjs-practice` の形式

status badge を更新

ドメインは `nuxtjs-firebase.lec.cafe` の形式で設定

https を矯正して完了。README のドメインを変更

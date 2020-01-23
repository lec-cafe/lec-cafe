# lec-cafe






## 資料リポジトリ

- `books_` 接頭辞で作成する。
- 教材と資料は別のリポジトリで作成する。
- 教材のリポジトリは `{資料名}_example` で作成する。
- netlify は リポジトリ 名でname を作成し、 books を抜いたサブドメインで URL 展開する。

資料管理シート

https://docs.google.com/spreadsheets/d/1lYk_0tCDxjAmFHjB6V3Eiflhw6eCJx7TA2jevTap1rM/edit#gid=835900849

## 教材の追加

`sample_` 接頭辞でリポジトリを作成する。

サブモジュールとしてリポジトリに追加する。

```bash
$ git submodule add https://github.com/lec-cafe/books_nuxtjs_practice books/nuxtjs_practice
```


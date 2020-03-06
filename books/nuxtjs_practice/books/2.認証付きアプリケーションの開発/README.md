# 認証付きアプリケーションの開発

本章では、Nuxt.jsを利用したSPA開発の手法について学んでいきます。

基本的なNuxt.jsの構文、記述等の解説は控えめに、
より実践的な部分のREST APIの利用方法やVuexを用いたデータ管理の手法について紹介していきます。

## 教材について

サンプルコードは以下に掲載しています。

https://github.com/lec-cafe/sample_nuxtjs_practice_auth

- master : デフォルトの状態
- 1-views : 画面の実装 [diff](https://github.com/lec-cafe/sample_nuxtjs_practice_auth/compare/master...1-view)
- 2-login : ログイン処理の実装 [diff](https://github.com/lec-cafe/sample_nuxtjs_practice_auth/compare/1-view...2-login)
- 3-store : ログイン処理の永続化 [diff](https://github.com/lec-cafe/sample_nuxtjs_practice_auth/compare/2-login...3-store)
- 4-auth : ログイン処理の共通化 [diff](https://github.com/lec-cafe/sample_nuxtjs_practice_auth/compare/3-store...4-auth)

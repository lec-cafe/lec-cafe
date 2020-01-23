# Axiosモジュールの使いかた

Nuxt.jsのAxiosモジュールは、 axiosライブラリの単純なラッパーです。

`this.$axios` 経由でaxiosオブジェクトにアクセスすることができます。

## axiosの使いかた

axiosでgetリクエストを行う場合は以下のような形になります。

```js
const response = this.$axios.get(url,options)
```

get以外のpost等のリクエストを行う場合は、
以下のような形で第二引数にRequest Bodyを含む形のリクエスト形式となります。

```js
const response = this.$axios.post(url, data, options)
```

getとpostでの形式の違いを吸収するためにURLやmethodsをoptionsに埋め込んで、
以下の形式でリクエストを送ることもできます。

```js
const response = this.$axios.axios.request(options)
```

optionsはリクエストの詳細パラメータとして、以下のような値を指定することが可能です。

```JS
{
  // リクエストの URL 
  url: '/user',
  // リクエストの Method
  method: 'get', 
  // リクエストの baseURL
  baseURL: 'https://some-domain.com/api/',
  // リクエストヘッダー
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  // リクエストURLに付与するクエリパラメータ
  params: {
    ID: 12345
  },
  // リクエストボディ
  data: {
    firstName: 'Fred'
  }
}
```

optionsの全容は、以下のドキュメントから確認できます。

https://github.com/axios/axios#request-config

### responseの形式

axiosを使ったHTTPリクエストの結果取得できるレスポンスオブジェクトは以下のような構造になっています。

```js
{
  // レスポンスボディ
  data: {},
  // レスポンスのステータスコード
  status: 200,
  // レスポンスのステータスコードの文字列表現
  statusText: 'OK',
  // レスポンスヘッダ
  headers: {},
  // axios から提供されるリクエストの config
  config: {},
  // response を生成するにあたって利用されたリクエストオブジェクト
  request: {}
}
```

## Nuxt.jsのaxios設定

Nuxt.jsのaxiosモジュールでは、 axiosのグローバル設定を、`nuxt.config.js` のaxiosセクションで設定することができます。

### `baseURL` `browserBaseURL`

`baseURL` はSSRフェーズでAPIが発行される際に利用されるAPIのbase URLで、
`browserBaseURL` はブラウザ上でAPIが発行される際に利用されるAPIのbase URLです。

`browserBaseURL` のデフォルト値は`baseURL` となっているため、SSRとブラウザでAPIの使い分けをしない場合に、
二重に設定する必要はありません。

### `retry`

APIのリクエストが失敗した際に、任意の回数API発行をリトライすることができます。
`true` をセットした際には3回のリトライが行われ、任意の回数リトライ指定を行う場合は、数値で設定します。
デフォルトの値は `false` でAPI発行エラー時のリトライを行いません。

### `debug`

`true` にセットすることで、 requestとresponseのログが発行されます。
デフォルトの値は `false` です。

その他のオプション値については公式のドキュメントを確認してください。

[Options - Axios Module](https://axios.nuxtjs.org/options)

## Helpers

Nuxt.jsのaxiosモジュールにはいくつかの便利なヘルパー関数が用意されています。

### Interceptors

axiosのinterceptorsを簡単に定義するためのヘルパーとして、以下の関数が用意されています。

- `onRequest(config)`
- `onResponse(response)`
- `onError(err)`
- `onRequestError(err)`
- `onResponseError(err)`

以下の様なプラグインを作成することで、REST API通信時のグローバルな処理を定義することができます。

```js
export default function ({ $axios, redirect }) {
  $axios.onError(error => {
    if(error.response.status === 500) {
      redirect('/sorry')
    }
  })
}
```

### `setHeader(name, value)`

共通のヘッダを定義する際などに、`setHeader` を利用して、共通のリクエストヘッダをセットすることができます。

```js
// Adds header: `Authorization: 123` to all requests
this.$axios.setHeader('Authorization', '123')
```

### `setToken(token, type)`

リクエスト共通で利用する認証ヘッダの定義に `setToken` 関数を利用する事ができます。

```js
// Adds header: `Authorization: Bearer 123` to all requests
this.$axios.setToken('123', 'Bearer')
```

参考： https://axios.nuxtjs.org/helpers

## 環境変数による設定の切り替え

axiosモジュールの機能の1つとして、環境変数を用いた設定の切り替えがあります。

以下の環境変数を定義すると、axiosのグローバル設定として自動的に認識されます。

- `API_URL` : `baseURL` の値を上書きします。
- `API_URL_BROWSER` : `browserBaseURL` の値を上書きします。





# 認証

本格的なアプリケーションで必要となる認証もまた、データの永続化が必要となる場面です。

認証は、認証トークンの永続化やユーザ情報の更新など、
永続化と再取得のフローが複雑で、自前で実装するには、やや複雑なところがあります。

こうした認証周りの永続化に関しては、
`vuex-persistedstate` を用いて自前で実装を行うよりも、
Nuxt.jsのAuth Moduleを利用するほうが高度に認証情報の永続化を実現できるかもしれません。

[Introduction - Auth Module](https://auth.nuxtjs.org/)

## Auth Modulesの導入

Nuxt.jsのAuth Modulesを利用するにはnpm経由でモジュールをインストールしてください。

```bash
$ npm i @nuxtjs/auth @nuxtjs/axios
```

モジュールのインストールができたら `nuxt.config.js` にてモジュールを有効化します。

```js
modules.export = {
  //...
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    // Options
  }  
}
```

::: tip
`auth-module` 利用時には  Vuex Storeを有効化する必要があります。
まだstoreフォルダに何も格納していない場合は、 `store/index.js` などを作成してVuexの機能を有効化してください。
:::

Auth Modulesを利用する上で必要な設定は以下の2つです。

- 認証関連のルート設定
- 認証処理を行うための通信設定

順にその内容を確認していきましょう。

## 認証関連のルート設定

SPAにおけるそれぞれのルートについて、ユーザの認証状態に応じた表示非表示の制御を行うことができます。

Auth Moduleで認証ユーザ向けのルートを作成する場合、ミドルウェアを用いるのが便利です。

それぞれのページコンポーネントで以下のようなにミドルウェアの指定を行い、
認証ルートで有ることを明示することができます。

```js
export default {
  middleware: 'auth',
  data(){
      return {
          //...
      }
  },
  mounted(){
      //...
  }  
}
```

それぞれのページコンポーネントにミドルウェアを設定するのが面倒で、
アプリケーション全体を認証ユーザ向けルートとする場合は、
`nuxt.config.js` に以下のような指定を行い、
アプリケーション全体にミドルウェアを適用します。

```js
router: {
  middleware: ['auth']
}
```

上記の設定を行った場合、個別のページコンポーネントで `auth: false` を設定し、
非認証ユーザ向けのルートを作成することも可能です。

```js
export default {
  auth: false,
  data(){
      return {
          //...
      }
  },
  mounted(){
      //...
  }  
}
```

また、認証ユーザ向けルートに、非認証ユーザがアクセスした際の挙動なども、
`nuxt.config.js` に`auth` を追加して定義することが可能です。

```js
modules.export = {
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    }    
  }
}
```

- `login` は未ログイン時に認証ルートへアクセスした際のリダイレクトURLです。
- `logout` はログアウト時のリダイレクトURLです。
- `callback` はOAuth認証等で必要となるコールバックルートです。
- `home` はログイン後のリダイレクトURLです。

## 認証処理を行うための通信設定

実際のAPIコール等を用いてユーザのログイン認証を行う処理を、
Auth Modulesでは `Strategies`  と呼びます。

Auth Modulesでは、いくつかの組み込み `Strategies` が用意されており、
GithubやFacebook / GoogleなどのOAuthを使った認証を簡単に実装することが可能なようになっています。

例えばGithub認証のアプリケーションを用意する場合、
`nuxt.config.js` の `auth` セクションに以下のような設定を追記します。

```js
modules.export = {
  auth: {
    strategies: {
        github: {
          client_id: '...',
          client_secret: '...'
        },
    }
  }  
}
```

以下のURLから取得した、
Githubのclient_idやclient_secretを埋め込み、認証処理の設定は完了です。

https://github.com/settings/developers

### local storategy

任意のスクラッチで用意した認証APIを利用する場合には `local` のstrategiesが利用可能です。

```js
modules.export = {
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { 
            url: '/api/auth/login', 
            method: 'post', 
            propertyName: 'token' 
          },
          logout: { 
            url: '/api/auth/logout', 
            method: 'post' 
          },
          user: { 
            url: '/api/auth/user', 
            method: 'get', 
            propertyName: 'user' 
          }
        },
      }
    }
  }
}
```

`endpoints` 内の各セクションに有効なAPIのURLやmethod, ヘッダー情報等を記述します。
構造は `$axios` のオプション構造となっています。

- `login` ログイン時に発行されるAPI
- `logout` ログアウト時に発行されるAPI
- `user` ユーザ情報取得時に発行されるAPI

Auth Moduleは内部でAPIを発行する際に、自動的にレスポンスを解釈しようとします。
`login` APIの場合は `token` キーからトークンを
`user` APIの場合は `user` キーからユーザ情報を取得するようになっていますが、
任意のキーでレスポンスを設定したい場合には `propertyName` にそのキー名を指定してください。

ユーザ情報の取得など認証が必要なAPIは `login` API経由で取得したトークンを用いて
認証付きのリクエストが実施されます。
トークンは `Bearer` 方式で各APIのヘッダに自動的に付与されるため、
アプリケーション内部の `$axios` 全てで、認証を意識せずAPIリクエストを送出することができます。

## Auth Modulesを用いたログイン処理

Auth Moduleの設定が終わったら実際にログインの処理を実行してみましょう。

Auth Moduleでは各種ログイン関連処理を`$auth` 経由で実行することができ、
ログインについては、 `$auth.loginWith()` 関数が用意されています。

```js
const { data } = await this.$auth.loginWith('github')
```

`$auth.loginWith()` は第一引数で指定したstrategiesを利用して、ログイン処理を実行します。

それぞれのログイン処理はstrategiesの実装に依存するため、
`local` storategyの場合には以下のような形で第二引数に認証情報を渡します。

```js
const { data } = await this.$auth.loginWith('local', {...opt})
```

`local` の場合、`$axios` を利用したAPIコールが行われPromiseがreturnされます。
フォーム等経由で取得されるログイン情報はaxiosのConfig形式で第二引数に渡すことが可能です。

### ログイン後のユーザ情報取得

ログイン後のユーザ情報は `this.$auth.user` 経由で取得可能です。

これは実際にはVuexに格納されたグローバルなデータとなっているため、
Vue.jsの開発ツール上で確認したり、 Vuexの形式でアクセスすることも可能です。

```js
// Access using $auth
this.$auth.user
​
// Access using vuex
this.$store.state.auth.user
```


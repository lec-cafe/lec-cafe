# 認証付きアプリケーションの開発

一般的なWebアプリケーションでは、ログインの機能を提供することで、
各ユーザに個別のサービスを提供することができるようになっています。

ログイン認証を必要とするアプリケーション開発では、
REST APIを経由したユーザ管理だけでなく、ログインしたユーザ情報の管理や、
ユーザがサイトを再訪したケースでのログインの永続化などが必要になってきます。

一般的なログイン画面経由でのログインのケースを想定し、
ログイン認証の機能がついたアプリケーション開発を体験してみましょう。

## 画面の作成

今回は以下の2つの画面が必要となります。

- ログイン画面
- マイページ画面

ログイン画面は、ユーザ名とパスワードを入力するフォームの画面です。

マイページ画面は、ログイン画面でのログイン処理後に遷移する画面で、
今回はシンプルにログイン中ユーザのユーザ名を表示してみます。

まずは、`npx create-nuxt-app` で、Nuxt.jsの開発環境を構築しましょう。

```
$ npx create-nuxt-app my_auth_app
```

フォルダが展開されたら、cdで移動し `npm run dev` コマンドを実行して、
開発用のWebサーバを立ち上げます。

```bash
$ cd my_auth_app
$ npm run dev
```

### ページ作成の準備

CSSの記述を簡単にするために  Twitter Booststrapを利用しましょう。

`nuxt.config.js` の `head.link` セクションにBootstrapのCDNを追加します。

```js
module.exports = {
  // ...
  head: {
    // ...
    link: [
      { rel: 'stylesheet', href: "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
}
```

次に、レイアウトファイルを調整します。

`layouts/defautl.vue`を編集して、以下のような内容で書き換えます。

```vue
<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container">
        <a class="navbar-brand" href="/">Navbar</a>
      </div>
    </nav>
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
  .container{
    max-width: 480px;
  }
</style>
```

## ログイン画面の作成

レイアウトの準備ができたら、各ページを作成します。

まずはログイン画面を、 `pages/index.vue` に以下のような形で作成します。

```vue
<template>
  <section>
    <h2>Login</h2>
    <form>
      <div class="form-group">
        <label>Email address</label>
        <input type="email" v-model="form.email" class="form-control" aria-label="Email" autocomplete="off">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="form.password" class="form-control" aria-label="パスワード" autocomplete="off">
        <small class="form-text text-muted">
          <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">こちら</a>
          <span>から取得した アクセストークンを入力ください。</span>
        </small>
      </div>
      <a href="#" class="btn btn-primary" @click.prevent="submit">ログイン</a>
    </form>
  </section>
</template>

<script>
  export default {
    data(){
      return {
        form: {
          email: "",
          password: "",
        }
      }
    },
    methods: {
      submit() {
        this.$router.push("/mypage")
      }
    }
  }
</script>

<style>
</style>
```

フォームの項目は`data`内の`form`変数でまとめて管理しています。

今回はEmailアドレスとパスワードを利用したログインフォームを用意します。

ログインボタンには`@click`でイベントを登録し、マイページへの遷移を実装しています。

## マイページ画面の作成

マイページ画面は `pages/mypage/index.vue` を作成して以下の内容で記述します。

```vue
<template>
  <div>
    <section>
      <h2>ようこそ、ユーザ さん</h2>
    </section>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
</style>
```

今回はログインの処理を実装するだけなので、
シンプルにログイン中のユーザ名のみを表示しています。

画面の準備ができたら、次は実際にREST APIを発行して、
アプリケーションとして動作できるように実装してみましょう。

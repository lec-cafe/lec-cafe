# ログイン処理の実装

画面の用意ができたところで、実際にログイン処理を実装していきましょう。

## ログイン処理

一般的なログイン処理では、提供されるログインAPIを利用して、ユーザ情報を取得する処理から始まります。

一般的な構成のログインAPIでは、
ユーザ名とパスワードのセットなどの認証情報を送信することで、
ログイントークンとユーザ情報を返却してれます。

ログイントークンは、ログイン後の画面等でAPIを発行する際など、
認証済みユーザの証として利用されるもので、各種API発行に必要不可欠なものになります。

::: tip
中には、認証情報を送信してログイントークンのみが提供されるAPIも見られますが、
そのようなケースではプロフィールAPIなどを用いて、トークン経由でユーザ情報を別途取得します。
:::

## ログインAPIの発行

では実際にログインAPIをコールするログイン処理を実装してみましょう。

今回もGitHubのREST APIを利用して処理の実装を行っていきます。

まずは、ログインAPIをコールするために、`@nuxtjs/axios` をインストールします。

```
$ npm i @nuxtjs/axios
```

モジュールのインストールが終わったら、`nuxt.config.js`を修正し、
`modules` セクションへのaxiosモジュールの追加と、
GitHub API をコールするための axios の接続設定を記述しておきましょう。
。

```js
export default {
  // ...
  modules: [
    '@nuxtjs/axios',
  ],
  // ...
  axios: {
    baseURL: "https://api.github.com"
  }
}
```

## ログイン処理の実装

準備ができたら実際にAPIを発行してみましょう。

今回は最初からVuexStoreを利用して、StoreモジュールベースでAPIの処理を記述していきます。

`store/user.js` を作成して、以下のような形で Vuex ファイルを作成します。

```js
export const user = () => {
  return {
    user: {
      token: null,
      display_name: null,
      avatar: null,
      account_name: null
    }
  }
}

export const mutations = {
  SET_USER(state, user){
    state.user = user
  }
}

export const actions = {
  async login({ commit }, form ) {
    const url = "/user"
    const response = await this.$axios.get(url, {
      headers: {
        Authorization: `token ${form.password}`
      }
    })
    if(form.email !== response.data.email) {
      throw new Error("ユーザ情報が異なります。")
    }
    commit("SET_USER", {
      token: form.password,
      display_name: response.data.name,
      avatar: response.data.avatar_url,
      account_name: response.data.login
    })
  }
}
```

::: tip
プロジェクトで始めて store 内にファイルを配置する場合、
`npm run dev` の再起動が必要になります。
:::

store ではユーザ情報の形を定義しています。
GitHubのREST API で取得可能な項目は後述する API 仕様ドキュメントから確認できます。

```js
export const user = () => {
  return {
    user: {
      token: null,
      display_name: null,
      avatar: null,
      account_name: null
    }
  }
}
```

mutation では単純に引数からデータを取得し、state にデータを格納しています。

```js
export const mutations = {
  SET_USER(state, user){
    state.user = user
  }
}
```

action では、実際のAPIコールを行っています。

今回は`GET /user` API を利用して REST API をコールしています。

https://developer.github.com/v3/users/#get-the-authenticated-user 

GitHub のREST APIではパスワード経由でのログインに対応していないため、
代わりにパーソナルアクセストークンを利用したログイン処理を実装しています。

トークンを用いてREST APIをリクエストすることでユーザ情報が取得可能になっており、
これらの情報をトークンとまとめて mutation 経由でストアに格納しています。

```js
export const actions = {
  async login({ commit }, form ) {
    const url = "/user"
    const response = await this.$axios.get(url, {
      headers: {
        Authorization: `token ${form.password}`
      }
    })
    if(form.email !== response.data.email) {
      throw new Error("ユーザ情報が異なります。")
    }
    commit("SET_USER", {
      token: form.password,
      display_name: response.data.name,
      avatar: response.data.avatar_url,
      account_name: response.data.login
    })
  }
}
```

ログイン処理の結果得られるユーザ情報は、アプリケーション内の至るところで参照されるため、
ほぼ大半のケースで、Vuexに格納する必要が出てくるでしょう。

## 画面からログイン処理を発行する

作成されたVuexを用いてログインの処理を実行してみましょう。

ログイ画面の `pages/index.vue` の `methods` を以下のような形で実装します。

```vue
<script>
  export default {
    // ...
    methods: {
      async submit() {
        try{
          await this.$store.dispatch("user/login",this.form)
          this.$router.push("/mypage")
        }catch (e) {
          alert("正しいログイン情報を入力してください。")
        }
      }
    }
  }
</script>
```

マイページの側では、ログイン後の挙動を確認するため、
以下のようにVuexを利用してStoreに格納されたユーザ情報を参照しておきましょう。

```vue
<template>
  <div>
    <section v-if="user">
      <h2>ようこそ、{{ user.display_name }} さん</h2>
    </section>
  </div>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user.user
      }
    }
  }
</script>

<style>
</style>
```

処理が記述できたら、実際に GitHub のEmailアドレスと、
以下のURLから取得可能なGitHub のパーソナルアクセストークンでログインの処理を実行してみてください。

https://github.com/settings/tokens

マイページに正しく遷移して、GitHub のユーザ名が表示されたら実装は成功です。

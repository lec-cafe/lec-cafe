# ログイン情報の保持

前回までで作成したアプリケーションは、ログイン画面からの遷移のフローは実装できていましたが、
画面をリロードするとログインが途切れて、再ログインが必要になってしまいます。

リロードしても既存のログイン情報を復元するには、
ログイン状態をブラウザに保存する必要があります。

## ログイン情報の保持

ログイン状態の保持を行う場合、以下の2つの方法が考えられます。

1. ログインユーザの情報を ブラウザにすべて保存する
2. ログインユーザのトークン情報のみを ブラウザに保存し、ユーザ情報をAPI で復元する

`1.` の方法はシンプルで実装も簡単ですが、
バックエンド側でのユーザ情報の更新や、ユーザ削除等に気づくことができない上に、
ブラウザ上に多くの個人情報を格納してしまうため、あまりおすすめできません。

一般的なアプリケーションでは、 `2.` の方法でトークンのみを保存し、
画面リロードのたびに、ユーザ情報を REST API で問い合わせてログイン状態を復元する処理を行います。

### localStorage 

ブラウザにデータを保管するには localStorage の利用が便利です。

localStorage にデータを保存するには `setItem` を利用します。

```js
localStorage.setItem("APP_TOKEN", token)
```

setItem では、第一引数で名前を指定してデータを保存することができます。

この指定した名前を利用して getItem にてデータを取得することが可能です。

```js
const token = localStorage.setItem("APP_TOKEN")
```

その他の詳しい使用方法は、MDN のドキュメントを参照ください。

https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage

## ログイン処理を復元する

まずは、Vuex のログイン処理で、ユーザのログイン状態をlocalStorageに保存します。

`store/user.js` を以下のような形で書き換えましょう。

```js
export const actions = {
  async login({ commit }, form ) {
    // ...
    commit("SET_USER", {
      token: form.password,
      display_name: response.data.name,
      avatar: response.data.avatar_url,
      account_name: response.data.login
    })
    localStorage.setItem("APP_TOKEN",form.password)
    this.$axios.setToken(form.password,"token")
  },
}
```

commit でのログイン処理の後に、`localStorage.setItem` を追加します。

合わせて、トークン情報を $axios に保存するための `$axios.setToken` もコールしておきましょう。

次にログイン状態を復元するための relogin を以下のような形で作成します。

```js
export const actions = {
  // ...
  async relogin({ state, commit }) {
    const token = localStorage.getItem("APP_TOKEN")
    if(!token){
      return false
    }
    const url = "/user"
    const response = await this.$axios.get(url, {
      headers: {
        Authorization: `token ${token}`
      }
    })
    commit("SET_USER", {
      token: token,
      display_name: response.data.name,
      avatar: response.data.avatar_url,
      account_name: response.data.login
    })
    localStorage.setItem("APP_TOKEN",token)
    this.$axios.setToken(token,"token")
    return true
  }
}
```

処理は ログインの処理とほとんど同じですが、localStorage に格納されたトークン情報を利用しているところが特徴です。

マイページ等のログインが必要画面で、この処理を呼び出して認証情報の復元リクエストを行います。

`mypage/index.vue` の mounted を以下のように書き換えてみましょう。

```vue
<script>
  export default {
    // ...
    async mounted() {
      const result = await this.$store.dispatch("user/relogin")
      if (!result) {
        alert("ログインが無効です。再ログインしてください。")
        return this.$router.push("/")
      }
    }
  }
</script>
```

これでリロードしてもログイン状態が正しく復元されるようになりました。

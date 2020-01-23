# アプリケーションの作成

## Nuxt.jsのセットアップ

Firebaseでのアプリケーション構築を始めるにあたって、
Nuxt.jsでアプリケーションを作成するための環境構築から始めていきましょう。

Nuxt.jsでアプリケーション開発を進める上で、現在最も一般的な方法は `npx` を利用した環境構築です。

`npx create-nuxt-app {project_name}` の形式でコマンドを実行すると対話形式でプロジェクトの作成が進みます。
エンターを押しながら、プロジェクトの構築を進めてください。

エラーなくセットアップが完了したら、`npm run dev` でサーバを立ち上げブラウザで初期画面を確認して下さい。

```
$ npm run dev
```

## 画面の作成

アプリケーションを作成するにあたって、まずは画面を作成してみましょう。

今回はコーディングを簡単にすすめるために、 Twitter Bootstrapを導入します。

Nuxt.jsでTwitter Bootstrapを利用する場合、
`nuxt.config.js` の `head.link` セクションにBootstrapのCDNを追加するのが簡単です。

```js
module.exports = {
  // ...
  head: {
    // ...
    link: [
      { rel: 'stylesheet', href: "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" },
      // ...
    ]
  },
}
```

### vueファイルの編集

Nuxt.jsの初期画面は `/layout/default.vue` と `/pages/index.vue` によって作成されています。

Vue.jsで利用されるこの `.vue` のファイルは、template / script / styleの3つの要素からなるファイルで、
HTML / JS / CSSを1つのファイルにまとめて記述することができます。

`layout/default.vue` は、複数のルートで共通で利用されるレイアウト定義です。

複数のルートを作成しても、`layout/default.vue` に記述された内容は全てのページで展開され、
ページごとに記述したコンポーネントの内容はレイアウトファイルの `<nuxt/>` 内に展開されます。

ここでは、以下のようにヘッダをつけて `layout/default.vue` を編集しておきましょう。

```vue
<template>
  <div class="container">
    <nav class="navbar navbar-light bg-light mb-3">
      <a class="navbar-brand" href="/">Chatapp</a>
    </nav>
    <nuxt/>
  </div>
</template>

<script >
export default {
    
}
</script>

<style>
  .container{
    max-width: 640px;
  }
</style>
```

次にページの本体を編集します。 

Nuxt.jsでは、`/pages` フォルダにvueファイルを作成すると、ページとしてそれを利用することができます。
vueファイルのURLがそのままページのアドレスとなるため、直感的にページを作成していくことができます。

トップページたる `/pages/index.vue` は以下のような形で実装してみましょう。

```vue
<template>
  <section class="container">

    <div class="mb-3">
      <div v-if="!user">
        <p>
          コメントを投稿するには、ユーザ名を入力してください。
        </p>
        <a class="btn btn-light btn-block" tabindex="" @click="login">ログイン</a>
      </div>

      <form v-if="user">
        <div class="form-group">
          <label>Name</label>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <div class="input-group-text">@</div>
            </div>
            <input type="text" class="form-control" v-model="user.name" disabled>
          </div>
        </div>
        <div class="form-group">
          <label>Comment</label>
          <textarea class="form-control" v-model="form.comment" rows="3"/>
        </div>
        <div class="form-group">
          <a class="btn btn-light btn-block" tabindex="" @click="submitPost">投稿</a>
        </div>
      </form>
    </div>

    <div class="list-group list-group-flush">
      <div class="list-group-item list-group-item-action flex-column align-items-start" v-for="(post,index) in posts" :key="index">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ post.user }}</h5>
          <small>{{ post.date }}</small>
        </div>
        <p class="mb-1">{{ post.comment }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data(){
    return {
      user: null,
      form: {
        comment: ""
      },
      posts: [
        {
          user: "mikakane",
          comment: "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.",
          date: "01/01 11:00"
        },
      ]
    }
  },
  methods: {
    login(){
        this.user = {
            name: "debug user"
        }
    },
    submitPost() {
      if (this.form.comment === "") {
        return false
      }
      const date = new Date()
      this.posts.push({
        comment: this.form.comment,
        user: this.user.name,
        date: `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      })
      this.form.comment = ""
    }
  }
}
</script>

<style>
</style>
```

画面上に掲示板のような画面が表示されればOKです。

ログインやコメントの追加を試してアプリケーションが動作することを確認してみましょう。

## Vuexによるデータ設計

画面の構築が完了したら実際にアプリケーションのロジックを組み込んでいきましょう。

SPAのように複数ページ構成になりうるアプリケーションの場合、
データのロジックを別ファイルに切り分けてページ間で共有する処理はとても重要になります。

Vue.jsにおけるデータ管理ロジックとしては、Vuexを用いるやり方が一般的で、
Nuxt.jsでもこれを利用することが可能です。

## Vuex Storeの作成

Vuex Storeはアプリケーションで使用するデータの定義と、
データ操作に関するロジックをまとめたJSモジュールです。

Nuxt.jsでVuexを使用する場合、 `store/index.js` を作成し、以下の内容を記述します。

```js
export const state = () => {
  return {
    user: null,
    posts: [
        {
          user: "mikakane",
          comment: "Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.",
          date: "01/01 11:00"
        }
    ]
  }
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user 
  },
  ADD_POST(state, post) {
    state.posts.push(post)
  }
}

export const actions = {
  loginWithUserName({commit}, name) {
    commit("SET_USER",{ name })
  },
  addPost({state,commit}, {comment}) {
    const date = new Date()
    const post = {
      comment,
      user: state.user.name,
      date: `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`    
    }
    commit("ADD_POST", post)
  }
}
```

Vuexではstate, mutation, actionsの3つを利用して、データの処理を記述します。

stateでは管理するデータを記述し、 mutationsではstateへのデータ操作を記述、
actionsでは、実際のアプリケーションのロジックを記述します」

### Vuex Storeの利用

Vuex Storeが作成できたら、`.vue` コンポーネントで記載されたページから 
Vuex Storeを利用してみましょう。

Vuex Store内のデータを利用する場合、 computedプロパティを利用して以下のように記述します。

```js
export default {
  //...  
  data () {
    return {
      form: {
        comment: ""
      },        
    }
  },
  computed: {
    user () {
        return this.$store.state.user
    },
    posts () {
        return this.$store.state.posts
    },
  },
  //...    
}
```

dataで記述していた `user` や `posts` はcomputedプロパティを利用してvuex側に記述することができるようになりました。
 
処理の部分では、actionsを呼び出すためのdispatch関数を利用して、以下のように記述することが可能です。

```js
export default {
  //...    
  methods: {
    login () {
      this.$store.dispatch("loginWithUserName", "debug user")
    },
    submitPost() {
      if (this.form.comment === "") {
        return false
      }
      this.$store.dispatch("addPost", {
        comment: this.form.comment
      })
      this.form.comment = ""
    }
  }
}
```

Vuexにコードを移行して画面が正常に動作すれば、画面の実装は完了です！

実際にFirebaseを利用しながらデータを処理してみましょう。

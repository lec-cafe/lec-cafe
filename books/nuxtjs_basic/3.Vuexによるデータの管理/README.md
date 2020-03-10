# Vuexによるデータの管理

REST APIを利用してGithubからデータを取得する事ができましたが、
API通信には若干の時間がかかります。

例えばIssueの一覧ページから個別ページに遷移する場面を考えてみると、
Issueの一覧ページでデータを取得して、また個別ページでもデータを取得して、
再度一覧に戻ったタイミングでもまたデータの取得が必要になります。

アプリケーションの仕様がゆるす限り、こうしたAPI通信結果のデータは
可能な限りで再利用していくのがUI設計的にも効率的です。

Vue.jsではアプリケーション内でデータを共有するための仕組みとしてVuexと呼ばれる仕組みが採用されています。
Vuexを利用することで、複雑なアプリケーション内のデータをシンプルに共有することができるようになります。

ここでは、先程取得したIssue一覧のデータをVuexに格納して、他のページで再利用する方法を考えてみましょう。

## データをVuexに格納する

Vuex StoreはVue.jsで利用可能なデータストアの構造です。

複数のページやvueコンポーネントで、データを共有する際に非常に便利なデータモデルとなっています。

Vuexでデータを管理するためには、以下の3つの仕組みを利用する必要があります。

- state : Vuex上で管理されるデータ
- mutation : stateを操作する関数。同期的に動作する。
- action : mutationを操作しながら実際のデータ操作ロジックを記述する非同期な関数

Vuexではこれらのstate mutation actionの3つを組み合わせながら、
アプリケーション全体で共有するデータを管理していきます。

![](/images/3/vuex.png)

https://vuex.vuejs.org/ja/

### Vuex Storeの作成

issue一覧のデータをページ間で共有できるように、Vuex Storeを構築してみましょう。

Nuxt.jsでは、`store` フォルダにコードを配置するだけで、
自動的にアプリケーションで利用可能なVuex Storeが構築されます。

まずは、`store/index.js` を作成して以下のようなコードを記述します。

```js
export const state = () => {
  return {
    issues: []
  }
}

export const mutations = {
  SET_ISSUES (state, issues) {
    state.issues = issues
  }
}

export const actions = {
  async fetchIssues (ctx) {
    const url = "/repos/lec-cafe/book_nuxt_api_state/issues"
    const {data} = await this.$axios.get(url, {
      headers: {
        Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
      }
    })
    console.log(data)
    ctx.commit("SET_ISSUES", data)
  }
}
```

::: tip 
初めて `store` フォルダ内にJSファイルを作成した場合、
既存の `npm run dev` プロセスを再起動する必要があります。
:::

Vuexでは、上記のような形で `exports` を使ってstate mutations actionsをそれぞれ記述していきます。

それぞれのコードを1つづつ確認していきましょう。

```js
export const state = () => {
  return {
    issues: []
  }
}
```

stateはvueコンポーネントからdata部分を抜き出したような構造です。 
Vuexステートの初期値を記述していきます。

```js
export const mutations = {
  SET_ISSUES (state, issues) {
    state.issues = issues
  }
}
```

mutationsはstateを変更するための関数です。
第一引数に `state`を、第二引数に任意の値を受け取る事ができます。

stateの変更はすべてこのmutations経由で行われるため、
mutationsの定義を確認すれば、stateにどの様な操作が行われるのかひと目で確認することができるようになります。

```js
export const actions = {
  async fetchIssues (ctx) {
    const url = "/repos/lec-cafe/book_nuxt_api_state/issues"
    const {data} = await this.$axios.get(url, {
      headers: {
        Authorization: "token YOUR_GITHUB_PRESONAL_ACCESS_TOKEN"
      }
    })
    console.log(data)
    ctx.commit("SET_ISSUES", data)
  }
}
```

actionsは実際のアプリケーションロジックを含む、 stateの操作関数です。

actionsは第一引数に `ctx` を受け取り、中から `ctx.commit` `ctx.dispatch` などの関数を受け取る事ができます。

`commit` はmutationsを呼び出すための関数で、第一引数にmutations名を、
第二引数は、mutations関数の第二引数に渡されます。

`dispatch` はactionsを呼び出すための関数で、他のactionをaction内で呼び出す際に利用されます。
第一引数はactions名で、第二引数は、 actions関数の第二引数に渡されます。

## Vuex Storeの利用

実際にVuex Storeが作成できたら作成したactionsをvueコンポーネントから利用していきましょう。

Issue一覧画面で、このVuex Storeを利用する場合、`pages/index.vue` は以下のような形になります。

```js
export default {
  data(){
    return {}
  },
  computed: {
    issues(){
      return this.$store.state.issues
    }
  },
  async mounted(){
    this.$store.dispatch("fetchIssues")
  }
}
```

dataで定義していた `issues` はVuex Storeからの参照でcomputedプロパティに置き換えられます。

データの取得は、 `this.$store.dispatch("fetchIssues")` としてactionをvueコンポーネント内部でコールします。

同様にmutationsもまた `this.$store.commit` を呼び出してコールすることができます。

Issueの個別のページ `pages/issue/_id/index.vue` では以下のようなコードになります。

```vue
<template>
  <section v-if="issue">
    <h2 class="mb-3">#{{issue.number}} {{issue.title}}</h2>
    <div class="text-right mb-5">
      <a :href="issue.html_url">Open Github</a>
    </div>
    <div class="mb-5">{{issue.body}}</div>
    <router-link class="btn btn-outline-primary" to="/">back</router-link>
  </section>
</template>

<script>

export default {
  data(){
    return {}
  },
  computed: {
    issue(){
      for(let issue of this.$store.state.issues){
        if(this.$route.params.id == issue.number){
          return issue
        }
      }
      return null
    }
  },
  created(){
    if(!this.issue){
      // データがないケースでは、一覧画面に戻る
      this.$router.push("/")
    }
  }
}
</script>
```

またこの場合、直接詳細画面にアクセスした場合、一覧画面でのmounted処理は走らないため、
Vuexのデータは空っぽです。

データがないケースでエラーにならないようcreatedで一覧への遷移処理を追加しています。

::: tip 
上記のようなstateデータの操作処理は、
getterを用いて記述することでよりシンプルに記述することも可能です。
:::

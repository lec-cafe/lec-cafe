# Vuex Storeのモジュール化

Vuex Store上のデータは、アプリケーションの規模に比例意して肥大化していきます。

単一の `store/index.js` ですべてのstateを管理するのは、
コードの可読性的にも、依存管理上でも問題があるため、
一定の規模でVuex Storeの分割を行う必要があります。

## Vuex Storeのモジュール化

例えば、Github APIのデータを管理するVuex Storeとして、
`store/github.js` を以下のような形で作成します。

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

`store/github.js` という名前で作成したVuex Storeは 
モジュール名 `github` のVuex Storeとして機能します。

このような形でモジュール化されたVuex Storeをvueコンポーネントから参照する際には、
以下のような方法を取ります。

```js
export default {
  data(){
    return {}
  },
  computed: {
    issues(){
      return this.$store.state.github.issues
    }
  },
  async mounted(){
    this.$store.dispatch("github/fetchIssues")
  }
}
```

stateはモジュール名によりネストされた状態で展開されます。

mutationsやactionsの呼び出しは、 モジュール名 `github/` のプレフィックスを利用した呼び出しが必要になります。

vueコンポーネントからの呼び出しとは対象的に、
モジュール内部でモジュール内のmutationsやactionsを呼び出す際には、
`commit("SET_ISSUES", data)` の様な形でモジュール名を意識せず記述できる点には注意してください。

## モジュール間の連携

あるモジュールから別のモジュールにアクセスする際には、注意が必要です。

```js
export const actions = {
    someAction ({ dispatch, commit, rootState }) {
      dispatch('someOtherAction', null, { root: true }) 

      commit('someMutation', null, { root: true })
    },
}
```

モジュール外のグローバルなstateには `rootState` を利用してアクセスすることが可能です。

また、`dispatch('someOtherAction')` のようにactionsをコールしても、
モジュール内の呼び出しになってしまうため、モジュール外のactionsをコールする際には、
第三引数に `{ root: true }` を付与します。
(第二引数はactionsのパラメータ）

## Vuex Storeのバインディング

Vuexで提供される バインディング ヘルパーを利用して、`this.$store` の記述を経由することなく、
簡単にVuexのオブジェクトを利用することができます。

### stateのマッピング

vueコンポーネント内でmapStateを利用することで、stateのマッピングを簡単に行うことができます。

```js
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      count: state => state.count,
    })    
  },
}
```

モジュールのstateをマップする場合には、第一引数にモジュール名を指定します。

```js
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      count: state => state.count,
    }),
    ...mapState('some/nested/module', {
      a: state => state.a,
      b: state => state.b
    })        
  },
}
```

### actions/mutationsのマッピング

vueコンポーネント内でmapActionsやmapMutationsを利用することで、actionsやmutations  のマッピングを簡単に行うことができます。

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', 
      'incrementBy' 
    ]),
    ...mapActions({
      add: 'increment' // 別名での登録
    })
  }
}
```

stateの際と同様に、第一引数にモジュール名を指定して、モジュールのactionsやmutationsを登録することもできます。

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', 
      'incrementBy' 
    ]),
    ...mapActions('some/nested/module', [
      'foo',
      'bar' 
    ])
  }
}
```

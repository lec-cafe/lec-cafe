# 認証処理の実装

## Vuex Storeの初期化

Vuexにアプリケーションの状態を保存しても、データはリロードしたタイミングでリセットされてしまいます。

Vuex上でのデータ取得処理をページコンポーネントのmountedで記述すると、
データを利用する様々な場面でこれを記述しなければならなくなり、管理が煩雑になります。

アプリケーション全体で必要なデータは、
プラグインを用いてページ表示前に初期化するなどして工夫することが可能です。

例えば特定のVuex Actionをページ表示前に呼出だす場合、
次のような `plugins/init.js` を作成して、 `nuxt.config.js` にプラグインを登録します。

```js
module.exports = (ctx) => {
  return ctx.store.dispatch("fetchIssues")
}
```

```js
// nuxt.config.js
module.exports = {
  plugins: [
    {src:"~/plugins/init.js"}
  ],
}
```

## Vuex Storeの永続化

毎回読み込む必要のないような固定的なデータに関しては、
`vuex-persistedstate` を利用してlocalStorageに永続化することもできます。

`vuex-persistedstate` はVuex Storeのデータを
localStorageに自動的に格納させるためのライブラリです。 

`vuex-persistedstate` はnpmでインストールして利用します。

```
$ npm i vuex-persistedstate
```

モジュールをインストールしたら、以下のような形で `~/plugins/localStorage.js` を作成します。

```js
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({})(store)
  })
}
```

作成したファイルをnuxt.config.jsに登録して準備は完了です。

```js
modules.export = {
  // ...
  plugins: [{ src: '~/plugins/localStorage.js', ssr: false }]
  // ...
}
```

`vuex-persistedstate` を有効化すると、
すべてのvuexデータが自動的にローカルストレージに格納されるようになり、
リロードしてもデータは消えなくなります。

すべてのVuexデータを保存するのが冗長で、特定のVuexデータのみを保持したい場合には、 
`createPersistedState` 関数のコール時にオプションでキーを渡します。

```js
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
        paths: [ 
          "issues"
        ]
    })(store)
  })
}
```

::: warning
localStorageにAPIの結果を保存して利用する場合、
それが最新のデータであるのかについては十分に検証する必要があります。

古いデータを用いたアプリケーション操作はときにサーバ上のデータ整合性を大きく損なう可能性もあります。
:::

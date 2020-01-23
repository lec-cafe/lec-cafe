# Vue コンポーネントの活用

Nuxt.js で頻繁に登場する 拡張子が `.vue` のファイルは、
Vue.js に特有の記述方法で Vue コンポーネントと呼ばれます。

`.vue` ファイルは `template` `script` `style` の３つの要素からなるファイルで、
それぞれ、 HTML , JavaScript , CSS を記述することができます。

## Vue コンポーネントのルール

`.vue` ファイルは `template` `script` `style` の３つの要素からなるファイルで、
一般的には以下のような構成を取ることが多いでしょう。

```vue
<template>
  <div>
    ...
  </div>
</template>

<script >
  export default {
    //...
  }
</script>
<style>
  .container{
    max-width: 640px;
  }
</style>
```

### template 要素

template 要素内では HTML を記述することができます。

HTML の他に Vue.js 特有の `{{  }}` を用いた変数展開や、
`v-xxx` などの固有の属性を用いて、アプリケーションの挙動を制御することも可能です。

Vue コンポーネントのルールとして、
template 要素の直下にはただ一つだけのHTML要素を持つことができます。

このため以下のような template の記述はエラーとなり認められません。

```vue
<template>
  <div>
    ...
  </div>
  <div>
    ...
  </div>
</template>
```

### script

script 要素内では javascript を記述します。

Vue コンポーネントに関する処理は、script 要素内で `export default { ... }` のような形で記述します。

script 要素を記述せずに Vue コンポーネントを記述すると、一部の環境でエラーとなるケースも有るため、
JavaScript に関する処理を記述しない場合でも、空の script 要素を以下のような形で記述しておくと良いでしょう。

```vue
<template>
  <div>
    ...
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

### style

style 要素内では css を記述できます。

style 要素に scoped プロパティを記述することで、
記述した css は コンポーネント内でのみ有効な CSS となります。

CSS のクラス名指定がページ間で重複する場合の管理などが大幅に削減できるため、
原則 style は scoped で運用すると良いでしょう。

```vue
<template>
  <div>
    ...
  </div>
</template>

<script >
  export default {
  }
</script>
<style scoped>
  .container{
    max-width: 640px;
  }
</style>
```

## コンポーネントの分割

pages フォルダに配置した Vue コンポーネントは URL 付きのルートとして利用されますが、
components フォルダに任意の Vue コンポーネントを配置して、
ページ内の各所で再利用することが可能です。

例えば、サイト内のロゴ画像を表示する以下のようなコンポーネントを
`components/SiteLogo.vue` というファイル名で作成してみましょう。

```vue
<template>
  <div>
    <img src="/images/logo.png" alt="lec cafe">
    Lec Cafe
  </div>
</template>

<script >
  export default {
  }
</script>

<style scoped>
</style>
```

これを `pages/index.vue` で利用する場合には以下のような形で記述します。

```vue
<template>
  <div>
    <site-logo />
  </div>
</template>

<script >
  import SiteLogo from "~/compoennts/SiteLogo.vue"
  export default {
    // ...
    components: {
      SiteLogo
    }
    // ...
  }
</script>

<style scoped>
</style>
```

script 要素内で、 `import` 文を利用してコンポーネントを読み込み、
`components`セクションに登録します。

変数名としてキャメルケースで登録したコンポーネントは、
template 要素内にて `-`区切りの ケバブケースのHTML要素名で利用可能になるため、
`SiteLogo` という名前で登録したコンポーネントは `site-logo` という要素名で利用可能になります。

## コンポーネントの活用

### コンポーネントへの変数渡し

コンポーネントは、利用時に値を受け取る事も可能です。

数値のカウントを表示するバッジのようなコンポーネントを考えてみましょう。

```vue
<template>
  <div>
    <div class="badge">
      {{count}}
    </div>
  </div>
</template>

<script >
  export default {
    props: {
      count: {
        type: Number,
        required: true
      }
    }
  }
</script>

<style scoped>
</style>
```

コンポーネント側では、受け取る値を props の形で定義することが可能です。
props で定義する値には、型を指定することが可能で、
数値なら `Number` 文字列なら `String` 配列なら `Array` オブジェクトは `Array` といった形で
定義することが可能です。

::: tip
props で定義した値と同名の変数を 
data や computed で定義するとエラーとなります。
:::

::: tip
props の型指定に関する詳細は、[公式ドキュメント](https://jp.vuejs.org/v2/guide/components-props.html) 
の記載も参照して下さい。
:::

このコンポーネントを利用する側の親では以下のように属性経由で値を渡すことが可能です。

```vue
<template>
  <div>
    <div>
      <span>新着お知らせ</span>
      <app-badge :count="4"/>
      
    </div>
  </div>
</template>

<script >
  import AppBadge from "~/components/Badge.vue"
  export default {
    // ...
    components: {
      AppBadge
    }
    // ...
  }
</script>

<style scoped>
</style>
```

::: tip
props 経由で受け取った値をコンポーネント内で変更してはいけません。
読み取り専用の値として利用してください。
:::

### コンポーネントとイベント

コンポーネント内でイベントを発生させて、親コンポーネントからそれを受け取る事も可能です。

詳しくは以下の公式ドキュメントを確認して下さい。

https://jp.vuejs.org/v2/guide/components.html#%E5%AD%90%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%92%E8%B3%BC%E8%AA%AD%E3%81%99%E3%82%8B

### コンポーネントとスロット

コンポーネント内に特定の HTML コンテンツを挿入するスロットと呼ばれる機能も用意されています。

詳しくは以下の公式ドキュメントを確認して下さい。

https://jp.vuejs.org/v2/guide/components.html#%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AB%E3%82%88%E3%82%8B%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E9%85%8D%E4%BF%A1

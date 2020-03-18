# Vueコンポーネントの活用

Nuxt.jsで頻繁に登場する拡張子が `.vue` のファイルは、
Vue.jsに特有の記述方法でVueコンポーネントと呼ばれます。

`.vue` ファイルは `template` `script` `style` の3つの要素からなるファイルで、
それぞれ、 HTML , JavaScript , CSSを記述することができます。

## Vueコンポーネントのルール

`.vue` ファイルは `template` `script` `style` の3つの要素からなるファイルで、
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

### template要素

template要素内ではHTMLを記述することができます。

HTMLの他にVue.js特有の `{{  }}` を用いた変数展開や、
`v-xxx` などの固有の属性を用いて、アプリケーションの挙動を制御することも可能です。

Vueコンポーネントのルールとして、
template要素の直下にはただ1つだけのHTML要素を持つことができます。

このため以下のようなtemplateの記述はエラーとなり認められません。

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

script要素内ではJavaScriptを記述します。

Vueコンポーネントに関する処理は、script要素内で `export default { ... }` のような形で記述します。

script要素を記述せずにVueコンポーネントを記述すると、一部の環境でエラーとなるケースも有るため、
JavaScriptに関する処理を記述しない場合でも、空のscript要素を以下のような形で記述しておくと良いでしょう。

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

style要素内ではcssを記述できます。

style要素にscopedプロパティを記述することで、
記述したcssはコンポーネント内でのみ有効なCSSとなります。

CSSのクラス名指定がページ間で重複する場合の管理などが大幅に削減できるため、
原則styleはscopedで運用すると良いでしょう。

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

pagesフォルダに配置したVueコンポーネントはURL付きのルートとして利用されますが、
componentsフォルダに任意のVueコンポーネントを配置して、
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

script要素内で、 `import` 文を利用してコンポーネントを読み込み、
`components`セクションに登録します。

変数名としてキャメルケースで登録したコンポーネントは、
template要素内にて `-`区切りのケバブケースのHTML要素名で利用可能になるため、
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

コンポーネント側では、受け取る値をpropsの形で定義することが可能です。
propsで定義する値には、型を指定することが可能で、
数値なら `Number` 文字列なら `String` 配列なら `Array` オブジェクトは `Array` といった形で
定義することが可能です。

::: tip
propsで定義した値と同名の変数を 
dataやcomputedで定義するとエラーとなります。
:::

::: tip
propsの型指定に関する詳細は、[公式ドキュメント](https://jp.vuejs.org/v2/guide/components-props.html) 
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
props経由で受け取った値をコンポーネント内で変更してはいけません。
読み取り専用の値として利用してください。
:::

### コンポーネントとイベント

コンポーネント内でイベントを発生させて、親コンポーネントからそれを受け取る事も可能です。

詳しくは以下の公式ドキュメントを確認して下さい。

https://jp.vuejs.org/v2/guide/components.html#%E5%AD%90%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%82%92%E8%B3%BC%E8%AA%AD%E3%81%99%E3%82%8B

### コンポーネントとスロット

コンポーネント内に特定のHTMLコンテンツを挿入するスロットと呼ばれる機能も用意されています。

詳しくは以下の公式ドキュメントを確認して下さい。

https://jp.vuejs.org/v2/guide/components.html#%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AB%E3%82%88%E3%82%8B%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E9%85%8D%E4%BF%A1

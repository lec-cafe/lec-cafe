# Nuxt.jsとLINT設定

## LINTERツールの導入

LINTERはプログラム上で自動的にコードのチェックを行うツールです。
LINTERを導入することで、コードの品質を高めることができます。

LINTERと呼ばれるツールは、(狭義の）LINTERとFORMATTERに分けることができます。

- LINTERプログラム上のエラーや、潜在的なバグ、推奨されない記述方法などを警告するもの
- FORMATTERインデントや改行、コードの書き方やルールを統一するもの

概ねLINTERはFORMATTERを兼ねますが、中にはFORMATTERのみで提供されるツールも存在します。

JavaScriptにおけるLINTERとして有名なものではeslintがあり、
JS/CSS/HTMLのFORMATTERとしてはprettierが有名です。

## ESLINTとPRETTIERの導入

eslintとprettierでvueファイルの整形を行うには、まず関連モジュールのインストールが必要です。

```bash
$ npm install --save-dev babel-eslint eslint eslint-config-prettier eslint-loader eslint-plugin-vue eslint-plugin-prettier prettier
```

eslintの設定ファイル `.eslintrc.js` をプロジェクトのルートに作成して準備は完了です。

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // より厳しいルールにするには`plugin:vue/strongly-recommended` もしくは `plugin:vue/recommended` に切り替えることを検討してください。
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  // *.vue ファイルを lint にかけるために必要
  plugins: [
    'vue'
  ],
  // ここにカスタムルールを追加します。
  rules: {
    'semi': [2, 'never'],
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': ['error', { 'semi': false }]
  }
}
```

prettierはeslintの拡張として実行可能なので、上記のような形でeslintの設定ファイル内でprettierのプラグインを読み込ませています。

プログラムの実行は、`eslint` コマンドで実行可能なため、 package.jsonに以下のコマンドを追記します。

```json
{
  //...
  "scripts": {
    //...
    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
    "lintfix": "eslint --fix --ext .js,.vue --ignore-path .gitignore ."
  },
  //...
}
```

`npm run lint` で各種エラーが確認可能で、 `npm run lintfix` では、エラーの自動修正が可能です。

### Webpack経由での自動実行

`nuxt.config.js` に以下のような記述を追加してWebpack経由での自動LINTを実行することも可能です。

```js
export default {
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        })
      }
    }
  },
}
```

コードを修正してWebpack buildが走るたびにeslintが実行されます。

eslint実行時にコードの修正も行いたい場合は、`fix` オプションが利用可能です。

```js
export default {
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
          options: {
            fix: true,
          }          
        })
      }
    }
  },
}
```

### eslintの設定


eslintの設定は、 `.eslintrc.js` 内でカスタマイズすることが可能です。

```js
module.exports = {
  // ...
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'semi': [2, 'never'],
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': ['error', { 'semi': false }]
  }
}
```

`extends` で `plugin:vue/recommended` のようにして、 Vue.js向けの拡張ルールを読み込んでいます。

`plugin:vue/recommended` で適用される各種ルールは以下のドキュメントから参照可能です。

https://eslint.vuejs.org/rules/

ルール名を用いて `rules` のセクションにオプションを渡すことも可能です。
値を `off` にすることで設定をわたせるほか、配列をわたすことでルールにオプション値を設定することも可能です。

また、eslintの機能として、JavaScript内で、 `/* eslint-disable */`  等のコメントを入れることでエラーの発生を制御することができますが、
HTMLテンプレート側ではこのような機能は用意されていません。

https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments

## Style Lintの導入

stylelintはCSSのためのLINTERツールです。

stylelintを用いてvueファイル内のCSSを整形するにはまず関連モジュールをインストールします。

```bash 
$ npm i -D stylelint @nuxtjs/stylelint-module stylelint-config-standard
```

Stylelintの設定は `.stylelintrc.json` に記述します。

```text
{
  "extends": "stylelint-config-standard"
}
```

Nuxt.jsでstylelintを利用可能にするため、 `buildModules` 内に

```js
export default {
  buildModules: [
    '@nuxtjs/stylelint-module'
  ],
  stylelint: {
      /* module options */
  },
}
```

として、設定を追記します。

::: tip
`buildModules` はnuxt@2.9から追加されたオプションで、
それ以前のNuxt.jsを利用するケースでは `modules` セクションを利用します。

stylelintのような本番環境で不要なモジュールは、
`buildModules`オプションに記述することで本番環境向けのJS配信サイズを削減することが可能です。
:::


Nuxt.jsのモジュールとして読み込むことで、自動的にwebpack等の設定が追加され、CSSのLINTチェックが可能になります。

### 手動でのセットアップ

`@nuxtjs/stylelint-module` では、SCSS等を含む全てのファイルにLINTがかかるため、
例えば .vueファイルのみのLINTなどの調整が必要な場合は、手動でのセットアップが必要です。

とはいえ、 stylelintは .vueをデフォルトで認識するため、
LINTの実行を行うstylelintコマンドを用いて、 package.jsonでのように設定すれば、LINTを手動で実行可能です。

```json 
{
  "scripts": {
      "dev": "nuxt",
      "build": "nuxt build",
      "start": "nuxt start",
      "generate": "nuxt generate",
      "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
      "lintfix": "eslint --fix --ext .js,.vue --ignore-path .gitignore .",
      "lint:css": "stylelint '**/*.vue'",
      "lintfix:css": "stylelint --fix '**/*.vue'",
      "precommit": "npm run lint"
  },
}
```

この例では、 LINT実行の `lint:css` と自動整形の `lintfix:css` を定義しています。

webpack経由でのLINT設定を行いたい場合には、`stylelint-webpack-plugin`を用いて以下のように記述します。

```bash
$ npm i -D stylelint-webpack-plugin
```

```js
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {

  // ...

  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.plugins.push(new StylelintPlugin({
          files: [
            '**/*.vue',
          ],
        }))
      }
    },
  },
}
```

fixオプションを付与して、 webpackビルド時にCSSの自動整形を実施することも可能です。

```js
const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {

  // ...

  build: {
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.plugins.push(new StylelintPlugin({
          files: [
            '**/*.vue',
          ],
        }))
      }
    },
  },
}
```


### SCSSの利用

scss記法のLINTを追加するには、`stylelint-scss` を追加し、`.stylelintrc.json` の `plugins` セクションに追加します。

```bash
$ npm i -D stylelint-scss
```

```json
{
  "extends": "stylelint-config-standard",
  "plugins": [
    "stylelint-scss"
  ]
}
```

stylelintは拡張子等の情報から、自動的にSCSS記述を判別可能なため、
.vueファイルの場合でも `lang=scss` 属性を記述することで自動的にscssのルールが適用されます。

::: tip
stylelintはデフォルトで拡張子からファイルタイプを認識するため、
一部で紹介されるような `--syntax scss` のオプションは不要です。
:::

.vueでscssを使う場合、以下のようなルールセットを追加しておくと良いでしょう。

```json
{
  "extends": "stylelint-config-standard",
  "plugins": [
    "stylelint-scss"
  ],
  "rules": {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true
  }
}
```


### stylelintのカスタマイズ

stylelintの各種ルールは、以下の公式サイトより内容を確認することができます。

https://stylelint.io/

デフォルトのルールセットでも十分強力にCSSのLINTを行うことが可能ですが、
必要に応じて、更に強力なルールを書けてCSSの記述範囲を絞ることも可能です。

```json
{
  // ...
  "rules": {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "selector-max-id": 0,
    "selector-combinator-whitelist": [],
    "selector-max-specificity": "0,2,0",
    "selector-nested-pattern": "^&(:hover|:focus|:last-of-type|::before|(__|--)([a-zA-Z0-9]*))$",
    "selector-class-pattern": [
      "^(c|p|l|is)-[a-zA-Z0-9]*(__[a-zA-Z0-9]*){0,1}(--[a-zA-Z0-9]*){0,1}$",
      {"resolveNestedSelectors": true}
    ]
  }
}
```

- `selector-max-id` は値を `0` にしてIDセレクタによるCSS定義を禁止できます。
- `selector-combinator-whitelist` は値を `[]` にして子孫セレクタ、隣接セレクタの仕様を禁止できます。
- `selector-max-specificity` は値を設定して、クラスセレクタの詳細度を限定できます。
- `selector-nested-pattern` はSCSSの入れ子記法における表現範囲を正規表現を使って絞り込むことができます。
- `selector-class-pattern` はクラスセレクタの表現範囲を正規表現を使って絞り込むことができます。

### CSSのreorder

`stylelint-config-recess-order` を利用してCSSプロパティの並び替えが可能です。

```bash
$ npm install --save-dev stylelint stylelint-config-recess-order
```

利用する場合は、 `.eslintrc.json` の `extends` に追記します。

```json
{
  "extends": [
     "stylelint-config-standard",
     "stylelint-config-recess-order"
   ],
  "rules": {
    // ...
  }
}
```

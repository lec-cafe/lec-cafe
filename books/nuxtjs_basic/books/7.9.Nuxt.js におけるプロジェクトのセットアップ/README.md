# Nuxt.js と LINT設定

## LINTER ツールの導入

LINTER はプログラム上で自動的にコードのチェックを行うツールです。
LINTER を導入することで、コードの品質を高めることができます。

LINTER と呼ばれるツールは、(狭義の)LINTER と FORMATTER に分けることができます。

- LINTER プログラム上のエラーや、潜在的なバグ、推奨されない記述方法などを警告するもの
- FORMATTER インデントや改行、コードの書き方やルールを統一するもの

概ね LINTER は FORMATTER を兼ねますが、中には FORMATTER のみで提供されるツールも存在します。

JavaScript における LINTER として有名なものでは eslint があり、
JS/CSS/HTML の FORMATTER としては prettier が有名です。

## ESLINT と PRETTIER の導入

eslint と prettier で vue ファイルの整形を行うには、まず関連モジュールのインストールが必要です。

```bash
$ npm install --save-dev babel-eslint eslint eslint-config-prettier eslint-loader eslint-plugin-vue eslint-plugin-prettier prettier
```

eslint の設定ファイル `.eslintrc.js` をプロジェクトのルートに作成して準備は完了です。

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

prettier は eslint の拡張として実行可能なので、上記のような形で eslint の設定ファイル内で prettier のプラグインを読み込ませています。

プログラムの実行は、`eslint` コマンドで実行可能なため、 package.json に以下のコマンドを追記します。

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

### Webpack 経由での自動実行

`nuxt.config.js` に以下のような記述を追加して Webpack 経由での 自動LINTを実行することも可能です。

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

コードを修正して Webpack build が走るたびに eslint が実行されます。

eslint 実行時に コードの修正も行いたい場合は、`fix` オプションが利用可能です。

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

### eslint の設定


eslint の設定は、 `.eslintrc.js` 内でカスタマイズすることが可能です。

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

`extends` で `plugin:vue/recommended` のようにして、 Vue.js 向けの拡張ルールを読み込んでいます。

`plugin:vue/recommended` で適用される各種ルールは以下のドキュメントから参照可能です。

https://eslint.vuejs.org/rules/

ルール名を用いて `rules` のセクションにオプションを渡すことも可能です。
値を `off` にすることで設定をわたせるほか、配列をわたすことでルールにオプション値を設定することも可能です。

また、eslint の機能として、JavaScript 内で、 `/* eslint-disable */`  等のコメントを入れることでエラーの発生を制御することができますが、
HTML テンプレート側ではこのような機能は用意されていません。

https://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments

## Style Lint の導入

stylelint は CSS のための LINTER ツールです。

stylelint を用いて vue ファイル内の CSS を整形するにはまず関連モジュールをインストールします。

```bash 
$ npm i -D stylelint @nuxtjs/stylelint-module stylelint-config-standard
```

Stylelint の設定は `.stylelintrc.json` に記述します。

```text
{
  "extends": "stylelint-config-standard"
}
```

Nuxt.js で stylelint を利用可能にするため、 `buildModules` 内に

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
`buildModules` は nuxt@2.9 から追加されたオプションで、
それ以前の Nuxt.js を利用するケースでは `modules` セクションを利用します。

stylelint のような本番環境で不要な モジュールは、
`buildModules`オプションに記述することで本番環境向けのJS配信サイズを削減することが可能です。
:::


Nuxt.js のモジュールとして読み込むことで、自動的に webpack 等の設定が追加され、CSS の LINT チェックが可能になります。

### 手動でのセットアップ

`@nuxtjs/stylelint-module` では、SCSS 等を含む全てのファイルに LINT がかかるため、
例えば .vue ファイルのみの LINT などの調整が必要な場合は、手動でのセットアップが必要です。

とはいえ、 stylelint は .vue をデフォルトで認識するため、
LINT の実行を行う stylelint コマンドを用いて、 package.json で のように設定すれば、LINT を手動で実行可能です。

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

この例では、 LINT 実行の `lint:css` と 自動整形の `lintfix:css` を定義しています。

webpack 経由でのLINT 設定を行いたい場合には、`stylelint-webpack-plugin`を用いて以下のように記述します。

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

fix オプションを付与して、 webpack ビルド時にCSS の自動整形を実施することも可能です。

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


### SCSS の利用

scss 記法の LINT を追加するには、`stylelint-scss` を追加し、`.stylelintrc.json` の `plugins` セクションに追加します。

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

stylelint は 拡張子等の情報から、自動的に SCSS 記述を判別可能なため、
.vue ファイルの場合でも `lang=scss` 属性を記述することで 自動的に scss のルールが適用されます。

::: tip
stylelint は デフォルトで拡張子からファイルタイプを認識するため、
一部で紹介されるような `--syntax scss` のオプションは不要です。
:::

.vue で scss を使う場合、以下のようなルールセットを追加しておくと良いでしょう。

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


### stylelint のカスタマイズ

stylelint の各種ルールは、以下の公式サイトより内容を確認することができます。

https://stylelint.io/

デフォルトのルールセットでも十分強力に CSS の LINT を行うことが可能ですが、
必要に応じて、更に強力なルールを書けて CSS の記述範囲を絞ることも可能です。

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

- `selector-max-id` は 値を `0` にして ID セレクタによる CSS 定義を禁止できます。
- `selector-combinator-whitelist` は 値を `[]` にして 子孫セレクタ、隣接セレクタの仕様を禁止できます。
- `selector-max-specificity` は 値を設定して、クラスセレクタの詳細度を限定できます。
- `selector-nested-pattern` は SCSS の入れ子記法における表現範囲を正規表現を使って絞り込むことができます。
- `selector-class-pattern` は クラスセレクタの表現範囲を正規表現を使って絞り込むことができます。

### CSS の reorder

`stylelint-config-recess-order` を利用して CSS プロパティの並び替えが可能です。

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

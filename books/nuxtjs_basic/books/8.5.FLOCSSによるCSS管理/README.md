# Nuxt.js における CSS 設計
 
## FLOCSS 

FLOCSS は CSS 設計手法の一つです。
FLOCSS の詳細設計は GitHub 上にて確認することができます。

> FLOCSS（フロックス） は、OOCSSやSMACSS、BEM、SuitCSSのコンセプトを取り入れた、モジュラーなアプローチのためのCSS構成案です。

https://github.com/hiloki/flocss

scoped css が利用可能とはいえ、コードの可読性は非常に重要な問題です。

Nuxt.js における FLOCSS 適用の例を確認して、CSS が管理可能な Nuxt.js の構成を考えてみましょう。

## FLOCSS - 基本原則

FLOCSS における Foundation は、ブラウザのデフォルトスタイルの初期化や、プロジェクトにおける基本的なスタイルを定義するレイヤーです。
これらは、グローバルなCSSを用いて定義すべきでしょう。

Layout のようなページ構成に関する CSS も グローバルな CSS を用いて定義するか、
Nuxt.js の layout 内部で定義するのが適切です。

Object における Component と Project は 再利用可能 / 固有のパターンという区別さされています。

Component は components 内での CSS (または グローバルな CSS)として、
Project は pages 内での CSS として記述するのが良いでしょう。

Utility を利用する場合にも、グローバルな CSS にて定義します。

## FLOCSS - クラスの命名

FLOCSS における クラス命名には、BEM が用いられています。

```text
.c-block {}
.c-block__element {}
.c-block--modifier {}
```

接頭辞の `c-` `p-` は Component と Project の分類として用いられているため、

- グローバルな CSS では、`c-` のみが利用可能
- components フォルダ内の CSS 定義は、 `c-` で記述する。
- pages フォルダ内の CSS 定義は、 `p-` で記述する。

と言ったルールが適用可能でしょう。

## FLOCSS - SCSS における運用

SCSS で FLOCSS を記述する場合、SCSS の記述にもいつくかの制約を設けることができます。

まずはじめに、BEM の形式を用いて、すべての要素は単一のクラスで記述されるため、
子孫セレクタを用いる必要はないでしょう。
SCSS の入れ子構造の書き方は以下のような形式に限定することができます。

```scss
.p-block{
  &__element{
    // ...
  }
  &--modifier{
    // ...
  }
}
```

このような形で BEM のブロック単位での入れ子形式で記述することで、
BEM のブロック単位で SCSS のコードの管理がしやすくなります。

Nuxt.js のプロジェクトでは、 Vue コンポーネントを利用して、
ページの要素を細かい単位に分割することが可能ですが、
BEM のブロックはより小さい単位として、Vue コンポーネント内でも複数の Block を定義するようにすれば、
よりまとまりのはっきりした、管理しやすい SCSS 構成が取れるでしょう。

## Nuxt.js における CSS 管理のポイント

scoped CSS がある以上、Nuxt.js における CSS は随分と簡略化できます。

特に `p-` 接頭辞の クラス名の衝突に関してはほとんど意識する必要がないでしょう。

`pages` フォルダ内で記述する ページ固有のスタイルに関しては、
`p-` 接頭辞のクラス名で記述して、scoped css として 記述することで、
クラス名管理のコストを大幅に削減することができます。

便利な scoped css ですが、共通化したいスタイルのルール付には注意が必要です。

同じようなスタイル記述を pages フォルダ内のコンポーネントで重複しなくてもいいよう、
再利用可能なスタイルは、 mixin よりも グローバルな CSS として定義しておく方が良いケースもあるでしょう。

- グローバルな CSS は アプリケーションの最初のロード時に読み込まれ、アプリケーション全体に適用されます。
- mixin で定義した共通スタイルルールを 各 pages フォルダ内のコンポーネントで利用する場合、
  スタイルの定義は ページごとに同じものがロードされます。

グローバルな CSS には、Foundation に該当するものや、Layout、Component に関するものが含まれます。
assets フォルダの構成は以下のような形で構成すると綺麗にまとまるでしょう。

```text
assets/scss
├── components - 各種 Component の定義
│   ├── _button.scss
│   └── _form.scss
├── _foudation.scss - Layout を記述する
├── _layout.scss - Layout を記述する
└── common.scss - 各種ファイルのimport を記述する
```

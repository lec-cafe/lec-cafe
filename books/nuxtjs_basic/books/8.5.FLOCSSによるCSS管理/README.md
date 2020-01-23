# Nuxt.jsにおけるCSS設計
 
## FLOCSS 

FLOCSSはCSS設計手法の1つです。
FLOCSSの詳細設計はGitHub上にて確認することができます。

> FLOCSS（フロックス） は、OOCSSやSMACSS、BEM、SuitCSSのコンセプトを取り入れた、モジュラーなアプローチのためのCSS構成案です。

https://github.com/hiloki/flocss

scoped cssが利用可能とはいえ、コードの可読性は非常に重要な問題です。

Nuxt.jsにおけるFLOCSS適用の例を確認して、CSSが管理可能なNuxt.jsの構成を考えてみましょう。

## FLOCSS - 基本原則

FLOCSSにおけるFoundationは、ブラウザのデフォルトスタイルの初期化や、プロジェクトにおける基本的なスタイルを定義するレイヤーです。
これらは、グローバルなCSSを用いて定義すべきでしょう。

Layoutのようなページ構成に関するCSSもグローバルなCSSを用いて定義するか、
Nuxt.jsのlayout内部で定義するのが適切です。

ObjectにおけるComponentとProjectは再利用可能 / 固有のパターンという区別さされています。

Componentはcomponents内でのCSS (またはグローバルなCSS)として、
Projectはpages内でのCSSとして記述するのが良いでしょう。

Utilityを利用する場合にも、グローバルなCSSにて定義します。

## FLOCSS - クラスの命名

FLOCSSにおけるクラス命名には、BEMが用いられています。

```text
.c-block {}
.c-block__element {}
.c-block--modifier {}
```

接頭辞の `c-` `p-` はComponentとProjectの分類として用いられているため、

- グローバルなCSSでは、`c-` のみが利用可能
- componentsフォルダ内のCSS定義は、 `c-` で記述する。
- pagesフォルダ内のCSS定義は、 `p-` で記述する。

と言ったルールが適用可能でしょう。

## FLOCSS - SCSSにおける運用

SCSSでFLOCSSを記述する場合、SCSSの記述にもいつくかの制約を設けることができます。

まずはじめに、BEMの形式を用いて、すべての要素は単一のクラスで記述されるため、
子孫セレクタを用いる必要はないでしょう。
SCSSの入れ子構造の書き方は以下のような形式に限定することができます。

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

このような形でBEMのブロック単位での入れ子形式で記述することで、
BEMのブロック単位でSCSSのコードの管理がしやすくなります。

Nuxt.jsのプロジェクトでは、 Vueコンポーネントを利用して、
ページの要素を細かい単位に分割することが可能ですが、
BEMのブロックはより小さい単位として、Vueコンポーネント内でも複数のBlockを定義するようにすれば、
よりまとまりのはっきりした、管理しやすいSCSS構成が取れるでしょう。

## Nuxt.jsにおけるCSS管理のポイント

scoped CSSがある以上、Nuxt.jsにおけるCSSは随分と簡略化できます。

特に `p-` 接頭辞のクラス名の衝突に関してはほとんど意識する必要がないでしょう。

`pages` フォルダ内で記述するページ固有のスタイルに関しては、
`p-` 接頭辞のクラス名で記述して、scoped cssとして記述することで、
クラス名管理のコストを大幅に削減することができます。

便利なscoped cssですが、共通化したいスタイルのルール付には注意が必要です。

同じようなスタイル記述をpagesフォルダ内のコンポーネントで重複しなくてもいいよう、
再利用可能なスタイルは、 mixinよりもグローバルなCSSとして定義しておく方が良いケースもあるでしょう。

- グローバルなCSSはアプリケーションの最初のロード時に読み込まれ、アプリケーション全体に適用されます。
- mixinで定義した共通スタイルルールを各pagesフォルダ内のコンポーネントで利用する場合、
  スタイルの定義はページごとに同じものがロードされます。

グローバルなCSSには、Foundationに該当するものや、Layout、Componentに関するものが含まれます。
assetsフォルダの構成は以下のような形で構成すると綺麗にまとまるでしょう。

```text
assets/scss
├── components - 各種 Component の定義
│   ├── _button.scss
│   └── _form.scss
├── _foudation.scss - Layout を記述する
├── _layout.scss - Layout を記述する
└── common.scss - 各種ファイルのimport を記述する
```

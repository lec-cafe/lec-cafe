const commonConfig = require("../../../../libs/common.config")

// .vuepress/config.js
module.exports = {
  ...commonConfig,
  title: 'Terminal での Git/Github入門 - Netlify でWebサイト公開',
  description: `
Terminal (黒い画面) を使っての Git/Github の使い方をマスターします。

Githubを操作しながら Web サイトの公開ができる Netlify を利用して、 実際のWebサイト制作をイメージしながら Git の操作を体験してみましょう。

Git の基本操作 (コミット・ブランチの操作)
Github の使い方 （push / pull）
GIthub のチームでの使い方 ( Issue / Pull Request )    `,
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/',
      '/1.JavaScriptと言語仕様',
      '/2.JavaScriptの基礎文法',
      {
        title: 'JavaScriptの組み込み型',
        children: [
          '/3.1.JavaScriptの文字列操作',
          '/3.2.JavaScriptの配列操作',
          '/3.3.JavaScriptのオブジェクト操作',
          // '/3.4.関数の利用Untitled',
          '/3.5.JSON の利用',
        ]
      },
      {
        title: 'ブラウザのAPI',
        children: [
          // '/9.1.モジュールシステムの利用',
          '/5.1.localStorage',
          '/5.2.Timer',
        ]
      },
      '/4.JavaScript文法の注意点',
      {
        title: '補足資料',
        children: [
          // '/9.1.モジュールシステムの利用',
          '/9.2.Promise async await',
        ]
      },
    ],
    docsDir: 'books/github_basic/books',
  }
}

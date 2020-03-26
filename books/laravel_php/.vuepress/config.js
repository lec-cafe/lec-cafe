module.exports = {
  title: 'Laravel で学ぶ PHP文法基礎',
  description: 'Laravel を 利用してREST API を作成するための 入門講座です。',
  head: [
    ['script', {src: "https://static.codepen.io/assets/embed/ei.js"}]
  ],
  locales: {
    '/': {
      lang: 'ja',
    },
  },
  markdown: {
    anchor: {
      level: [1, 2, 3],
      slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    },
    config: md => {
      md.use(require('markdown-it-playground'))
    },
    linkify: true
  },
  themeConfig: {
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/1.PHPと言語仕様',
      '/2.PHP基礎文法',
      {
        title: 'PHPの関数操作',
        children: [
          '/3.1.PHPの文字列操作',
          '/3.2.PHPの配列操作',
          '/3.3.PHPのファイル操作',
        ]
      },
      {
        title: 'PHPのクラス操作',
        children: [
          '/4.1.PHPのクラス活用',
        ]
      },

    ],
    repo: 'lec-cafe/books_laravelapi_basic',
    repoLabel: 'Github',
    docsDir: 'books',
    editLinks: true,
    editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
  }
}

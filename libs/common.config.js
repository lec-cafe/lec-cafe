// .vuepress/config.js
module.exports = {
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
    repo: 'lec-cafe/lec-cafe',
    repoLabel: 'Github',
    editLinks: true,
    editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
  }
}

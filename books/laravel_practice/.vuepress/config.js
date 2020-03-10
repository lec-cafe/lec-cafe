const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  title: 'Laravel REST API 開発 入門',
  description: 'HTML/CSS を使った Web 制作技術について、現場で使えるテクニックを紹介します。',
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      {
        title: 'Laravel と Database',
        children: [
          '/2.1.Schema',
          '/2.2.Seeder',
          '/2.3.Eloquentの基本操作',
          '/2.4.Eloquentとリレーション',
        ]
      },
      {
        title: '補足資料',
        children: [
        ]
      },
    ],
    docsDir: 'books/laravel_practice',
  }
}

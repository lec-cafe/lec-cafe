const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  title: 'Laravel 実践講座',
  description: 'HTML/CSS を使った Web 制作技術について、現場で使えるテクニックを紹介します。',
  themeConfig: {
    ...commonConfig.themeConfig,
    nav: [
      {text: 'Lec Café', link: 'https://leccafe.connpass.com/'},
    ],
    sidebar: [
      '/1.アプリケーションの設計',
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
        title: 'コード分割とモジュール',
        children: [
          '/3.1.Repositoryパターン',
          '/3.2.DIコンテナの活用',
          '/3.3.ServiceProviderの利用',
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

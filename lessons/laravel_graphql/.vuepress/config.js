const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  base: "/laravel_graphql",
  title: 'Laravel GraphQL 開発 入門',
  description: 'Laravel と lighthouse を利用して GraphQL を作成するための 入門講座です。',
  themeConfig: {
    ...commonConfig.themeConfig,
    sidebar: [
      '/01.setup',
      '/02.database',
      '/03.query',
      '/04.mutations',
      '/05.mutations2',
      '/06.input',
      '/07.validations',
    ],
    docsDir: 'lessons/laravel_graphql',
  }
}

const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  base: "/nuxtjs_website/",
  dest: "dist/nuxtjs_website",
  title: 'Nuxt.js で始める Webサイト制作',
  description: 'Nuxt.js で始める Webサイト制作の入門講座です。',
  themeConfig: {
    ...commonConfig.themeConfig,
    sidebar: [
      '/01.setup',
      '/02.page',
      '/03.layout',
      '/04.routing',
      '/05.scss',
      '/06.build',
      '/07.assets',
      '/08.meta',
    ],
    docsDir: 'lessons/nuuxtjs_website',
  }
}

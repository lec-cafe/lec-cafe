const commonConfig = require("../../../libs/common.config")

module.exports = {
  ...commonConfig,
  base: "/",
  dest: "dist",
  title: 'Lec Cafe',
  description: 'Lec Cafe は動画で学べるオンラインのWeb制作セミナーです。',
  themeConfig: {
    ...commonConfig.themeConfig,
    sidebar: [
    ],
    docsDir: 'lessons/top',
  }
}

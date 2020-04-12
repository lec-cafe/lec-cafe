const path = require('path')
const spawn = require('cross-spawn')

module.exports = (options = {}, context) => ({
  async extendPageData ($page) {
    const { transformer, dateOptions } = options
    const pageInfo = options.lessons[$page.relativePath]
    if(pageInfo){
      $page.title = pageInfo.title
      $page.description = pageInfo.description
      $page.video = pageInfo.video
    }else{
      console.log(      $page.relativePath)
    }
  }
})


<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{$page.title}}</h1>
      <div style="text-align: right" v-if="$page.video">
        <a :href="$page.video" target="_blank">動画講座はこちら</a>
      </div>
      <p>{{$page.description}}</p>
      <Content/>
    </div>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
  import PageEdit from '@theme/components/PageEdit.vue'
  import PageNav from '@theme/components/PageNav.vue'
  export default {
    components: { PageEdit, PageNav },
    props: ['sidebarItems']
  }
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'
.page
  padding-bottom 2rem
  display block
</style>

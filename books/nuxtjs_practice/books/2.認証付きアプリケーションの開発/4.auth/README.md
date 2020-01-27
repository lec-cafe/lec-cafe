# 認証処理の共通化

先程までで作成したアプリケーションでは、
ログインが必要な画面の mounted で認証処理を記述しており、
ログインページ作成のたびに 認証の復元実装を記述しなければなりません。

## layout による共通化

Nuxt.js では layout を利用することで、画面だけでなく処理の共通化も行うことができます。

`layout/mypage.vue` を以下のような形で作成してみましょう。

```vue
<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container">
        <a class="navbar-brand" href="/">Mypage</a>
      </div>
    </nav>
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
  export default {
    async mounted() {
      const result = await this.$store.dispatch("user/relogin")
      if (!result) {
        alert("ログインが無効です。再ログインしてください。")
        return this.$router.push("/")
      }
    }
  }
</script>

<style>
  .container{
    max-width: 480px;
  }
</style>
```

`pages/mypage/index.vue` のほうでは、 `layout` を追加します。

```vue
<script>
  export default {	  
    layout: "mypage",
    // ...
  }
</script>
```

これで、mypage のレイアウトを利用する箇所では、自動的に認証処理の復元が行われるようになります。

各認証ページでの mounted では relogin を実行する必要はなくなりますが、
relogin の処理を page 側の mounted でもコールすることで、
認証処理の復元が完了したタイミングで各種APIの発行処理を行うことができます。

`pages/mypage/index.vue` のほうでは、 `layout` を追加します。

```vue
<script>
  export default {	  
    layout: "mypage",
    // ...
    async mounted() {
      await this.$store.dispatch("user/relogin")
      // 以下認証処理が完了してからの処理
    }

  }
</script>
```

## plugin による共通化

先程の処理では、各ページで認証処理の復元が可能になりましたが、
ページとレイアウトで ともに relogin を発行した際に、API が二重にコールされていまいます。

aciton の二重発行を制御するために plugin を作成して、store アクションへのコールを制御してみましょう。

`plugins/auth.js` 

```js
let promise = null

export default ({ store }, inject) => {
  inject('auth', {
    user(){
      if(promise) {
        return promise
      }else{
        promise = new Promise(async (resolve)=>{
          if(store.state.user.user && store.state.user.user.display_name){
            return store.state.user.user
          }
          if(promise){
            return promise
          }
          await true
          await true
          const result = await  store.dispatch("user/relogin")
          return resolve(result)
        })
        return promise
      }

    }
  });
};
```

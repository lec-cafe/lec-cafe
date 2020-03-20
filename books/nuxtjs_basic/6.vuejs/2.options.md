# Vue.js のオプション

## オプション

###props 
親コンポーネントから子コンポーネントにデータの受け渡しをするときに用いるオプションがpropsです。
親コンポーネントから子コンポーネントにデータの受け渡しをすることをprops downといいます。
子コンポーネントは親コンポーネントからのデータをpropsオプションで受け取ります。

```parent.vue（親）
<template>
  <div>
//子コンポーネント
    <child　val='A'></child>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        components:{
        Child
        }
      }
    }
  }
</script>

<style scoped>
</style>
```
親コンポーネントのなかで子コンポーネントにたいして「A」というデータを渡しています。

```Child.vue(子)
<template>
  <div>
   <p>{{val}}</p>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        props:['val']
      }
    }
  }
</script>

<style scoped>
</style>
```

子コンポーネントは親コンポーネントにからのデータを受け取るためにscriptタグのなかのpropsないで指定します。
propsを指定しなければデータの受け渡しができません。


###data
'data'はアプリケーション内で使用するデータの集合体です。
登録できる値として数値型、文字列型、真偽値、オブジェクト、配列などが利用できます。
以下の<script></script>の中の 'data'の'message'の中で 'hello world'を定義しています。
ここで定義した 'message'は''template'の'{{message}}'に反映されています。

```vue
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        message: "hello world"
      }
    }
  }
</script>

<style scoped>
</style>
```

###computed
computedオプションはすでに存在する値(プロパティ)に対して何らかの演算をした結果を返すためのプロパティです。
以下のようにtemplateタグ内で定義した、'{{message}}'に対して何らかの処理を施した結果を返したいときにcomputedオプションを使います。
ここでは '{{message}}' に対して大文字に変換するcomputedオプションをみてみます。

```vue
<template>
  <div>
    <div class="message">
      {{ message }}
    </div>
  </div>
</template>

<script >
  export default {
    data(){
      return {
        data:{
            message:'message'      
         },
        computed:{
            UpperCase:function(){
                  return this.message.toUpperCase();              
            }
        }         
      }
    }
  }
</script>

<style scoped>
</style>
```
この結果として'{{message]}'の表示は'MESSAGE'になります。
似たようなオプションとして 'methods'オプションがありますが 'computed'オプションとの違いとして
1, 引数を持てない
2,値がキャッシュされる（一度読み込んだあとは値を変更できない）
といった点があります。


###methods
'methods'オプションは''computed'オプションとほとんど同じ意味ですが、以下の相違点があります。
1,'method'オプションは引数を持つことができる。
2,値がキャッシュされない。（値が保存されないため読み込み後でも値の変更が可能）

'methods'の主な役割はデータの取得や、要素の操作や更新です。


## ライフサイクル
ライフサイクルとはVueインスタンスがデータの変化に応じてビューを更新させていき、破棄されるまでの流れのことをいいます。
以下のコードでライフサイクルの順番をコンソール上で確認することができます。

```vue
<template>
  <div>
  </div>
</template>

<script >
 export default{
  created:(){
          console.log('created');
      },
  mounted:(){
            console.log('mounted');
      },  
  destroyed:(){
            console.log('destroyed');
      }             

}
</script>

<style scoped>
</style>

```


- created

ライフサイクルのなかで、インスタンスが生成されたときのことを'mounted'といいます。

- mounted 

ライフサイクルのなかで、インスタンスがページに紐づいたときを'mounted'といいます。

- destroyed

ライフサイクルのなかでインスタンスが破棄されたあとのことを'destroyed'といいます。

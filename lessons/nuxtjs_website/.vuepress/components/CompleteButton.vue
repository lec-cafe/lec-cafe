<template>
  <div>
    <div class="btn-wrapper">
      <button :class="{complete: isComplete, btn: btn}" @click="clicked">
        <span v-if="!isComplete">未完了</span>
        <span v-if="isComplete">完了済み</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        isComplete: false,
        btn: true
      }
    },
    methods:{
      clicked(){
        this.isComplete =! this.isComplete
          this.btn =! this.btn
      }
    }
  };
</script>
<style>
  .btn-wrapper{
    text-align: center;
  }
  .btn {
    display: inline-block;
    font-size: 15px;
    width: 150px;
    height: 50px;
    padding: 0.3em 1em;
    text-decoration: none;
    color: #3FAF7C;
    border: solid 2px #3FAF7C;
    border-radius: 3px;
    transition: .4s;
  }
  .btn:hover {
    background: #3FAF7C;
    color: white;
  }
  .complete{
    display: inline-block;
    font-size: 15px;
    width: 150px;
    height: 50px;
    padding: 0.3em 1em;
    text-decoration: none;
    color: orange;
    border: solid 2px orange;
    border-radius: 3px;
    transition: .4s;
  }
</style>

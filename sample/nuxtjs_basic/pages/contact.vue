<template>
  <div >
    <form>
      <h1 class="h3">お問い合わせ</h1>
      <div class="form-group">
        <label>お名前</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input type="email" class="form-control">
      </div>
      <div class="form-group">
        <label>件名</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>メッセージ</label>
        <textarea class="form-control" rows="5"/>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
}
</script>

<style>

</style>

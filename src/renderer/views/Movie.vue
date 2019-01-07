<template>
  <div id="movie">
    <h2>当前处于“电影”页面</h2>
  </div>
</template>

<script>
  export default {
    name: 'movie',

    props: {
      id: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  #movie {
    padding-top: 50px;
    text-align: center;
  }
</style>

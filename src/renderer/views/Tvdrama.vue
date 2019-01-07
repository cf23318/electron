<template>
  <div id="tvdrama">
    <h2>当前处于“电视剧”页面</h2>
  </div>
</template>

<script>
  export default {
    name: 'tvdrama',

    props: {
      id: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  #tvdrama {
    padding-top: 50px;
    text-align: center;
  }
</style>

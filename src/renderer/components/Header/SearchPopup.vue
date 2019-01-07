<template>
  <div class="search-popup" tabindex="99999">
    <search-history></search-history>
    <search-popular></search-popular>
  </div>
</template>

<script>
  import SearchHistory from './SearchHistory.vue'
  import SearchPopular from './SearchPopular.vue'

  export default {
    name: 'search-popup',

    components: {
      SearchHistory,
      SearchPopular
    }
  }
</script>

<style lang="scss" scoped>
  .header__search:focus-within {
    .search-popup {
      display: block;
    }
  }

  .search-popup {
    display: none;
    position: absolute;
    left: 15px;
    top: calc(100% + 6px);
    width: 370px;
    z-index: 999;
    background: #4F5154;
    outline: none;
  }
</style>

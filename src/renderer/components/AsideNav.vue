<template>
  <aside id="aside-nav">
    <window-action class="aside-nav__window-action" system="mac"></window-action>

    <ul>
      <li v-for="info in asideNav" :key="info.id" :class="{selection: info.id === selectionAsideNavId}" v-text="info.name" @click="handlerClick({url: info.url, id: info.id})"></li>
    </ul>
  </aside>
</template>

<script>
  import WindowAction from 'components/WindowAction.vue'

  export default {
    name: 'aside-nav',

    components: {
      WindowAction
    },

    computed: {
      selectionAsideNavId () {
        return this.$route.meta.asideNavId
      },
      asideNav () {
        return this.$store.state.setting.asideNav
      }
    },

    methods: {
      handlerClick ({url, id}) {
        if (url) {
          this.$router.push(url)
        } else if (id) {
          this.$router.push(`/home/${id}`)
        } else {
          this.$router.push({ name: 'welcome' })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #aside-nav {
    flex-shrink: 0;
    width: 125px;
    height: 100%;
    background: #4D5053;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 14px;

    .aside-nav__window-action {
      height: 50px;
      padding-left: 16px;
    }

    li {
      position: relative;
      height: 34px;
      line-height: 34px;
      padding-left: 24px;
      cursor: pointer;

      &.selection {
        color: $primary-color;

        &::before {
          content: '';
          position: absolute;
          left: 14px;
          top: 10px;
          width: 2px;
          height: 14px;
          background: $primary-color;
        }
      }
    }
  }
  
  #app.win {
    #aside-nav {
      padding-top: 50px;
    }
  }
</style>

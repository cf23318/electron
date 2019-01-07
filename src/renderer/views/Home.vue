<template>
  <div id="home">
    <h2>当前处于“精选”页面 0.0.13</h2>

    <div>1111</div>

    <div class="responsive">
      <div class="site__header">
        <div class="site__header__slide">
          <kan-swiper></kan-swiper>
        </div>
        <div class="site__header__recommand">
          <h3 class="site__header__recommand__title">今日推荐</h3>
          <div class="site__header__recommand__list">
            <div class="list__item" v-for="i in 3" :key="i" :a="i">
              <div class="list__item__left">
                <img src="http://fscdn1.ytbbs.tv/2018/tv/20180925/960e1f377b286224ec46076730cf028d.jpg?x-oss-process=image/resize,w_380,h_532/sharpen,100/quality,Q_100" alt="">
              </div>
              <div class="list__item__right">
                <div class="list__item__right__box">
                  <h5 class="list__item__title">我的体育老师我的体育老师</h5>
                  <p class="list__item__hot"><i class="iconfont icon-hot"></i><span>234567</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <test-swiper></test-swiper>

    <div>1111</div>
    
    <div>当前user name值为{{$store.state.user.name}}</div>
    <div><input v-model="userName" /></div>
    <div><button @click="submit">点击提交user name</button></div>
    <div><button @click="openVideo">点击打开video页面</button></div>
    <div><button><router-link :to="{name: 'player', params: { id: '001', partId: '002' }}">点击进入video页面</router-link></button></div>
    <div><button @click="clear">清理</button></div>
    <div><button @click="openDownloadWindow">打开视频下载窗口</button></div>
    <div><button @click="openLogin">打开登入窗口</button></div>

    <mod-box :title="'精选'" :filter="['精选','内地','欧美','港台','韩国','日本','热门','最新','高分','筛选']"></mod-box>
  </div>
</template>

<script>
  import ModBox from 'components/ModBox.vue'
  import KanSwiper from 'components/KanSwiper.vue'
  import TestSwiper from 'components/TestSwiper.vue'

  import { PLAYER__OPEN_PLAYER, PLAYER__OPEN_DOWNLOAD, OPEN_LOGIN } from 'ipc-types'
  import { USER__SET_USER_INFO } from 'store-types'

  export default {
    name: 'home',

    props: {
      id: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        userName: ''
      }
    },

    components: {
      ModBox,
      KanSwiper,
      TestSwiper
    },

    methods: {
      submit () {
        this.$store.dispatch(USER__SET_USER_INFO, { name: this.userName })
      },
      openVideo () {
        const randomId = parseInt(Math.random() * 50 + 10000).toString()
        const randomPartId = parseInt(Math.random() * 50 + 10000).toString()

        this.$electron.ipcRenderer.send(PLAYER__OPEN_PLAYER, {
          id: randomId,
          partId: randomPartId
        })
      },
      clear () {
        this.$vuexElectronStore.clear()
      },
      openDownloadWindow () {
        this.$electron.ipcRenderer.send(PLAYER__OPEN_DOWNLOAD, {
          id: '0001'
        })
      },
      openLogin () {
        this.$electron.ipcRenderer.send(OPEN_LOGIN)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #home {
    padding-top: 50px;
    text-align: center;
    background: #3A3D40;
  }

  .site__header {
    display: flex;

    .site__header__recommand {
      flex-shrink: 0;
      width: 220px;
      margin-left: 10px;
      background: #42444A;
      text-align: left;
      padding: 10px;

      .site__header__recommand__title {
        margin: 0 0 6px;
        font-size: 12px;
        line-height: 14px;
        color: $secondary-text-color;
      }

      .site__header__recommand__list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 20px);

        .list__item {
          font-size: 0;

          .list__item__left {
            display: inline-block;
            vertical-align: top;
            width: 110px;
            height: 65px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .list__item__right {
            display: inline-block;
            vertical-align: top;
            width: 84px;
            height: 65px;
            margin-left: 6px;
            
            .list__item__right__box {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
  
              .list__item__title, .list__item__hot {
                font-size: 13px;
                margin: 0;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                span {
                  color: $secondary-text-color;
                }
  
                i {
                  font-size: 13px;
                  color: $orange;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

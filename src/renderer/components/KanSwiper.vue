<template>
  <div
    class="kanswiper"
    @mouseover="hoverPoster"
    @mouseout="leavePoster"
    >
    <div class="kanswiper__poster">
      <img class="kanswiper__poster__img" :src="currentPosterSrc" alt="">
    </div>

    <div class="kanswiper__titleswiper">
      <div class="kanswiper__titleswiper__left">
        <swiper :options="swiperOption" ref="kanSwiper">
          <swiper-slide v-for="i in Math.ceil(Poster.length / numberInSingleSlide)" :key="i">
            <ul class="kanswiper__titleswiper__ul">
              <li
                v-for="(item, index) in Poster.slice(numberInSingleSlide * i - numberInSingleSlide, numberInSingleSlide * i)"
                :key="item._id"
                :data-index="index"
                :class="{'active': item.active}"
                @mouseover="hoverSwiper($event, item)"
                @mouseout="leaveSwiper($event, item)"
                >{{item.title}}</li>
            </ul>

            <resize-observer @notify="handleResize" />
          </swiper-slide>
        </swiper>
      </div>

      <div class="kanswiper__titleswiper__right">
        <span class="kanswiper__titleswiper__right__page"></span>

        <span class="kanswiper__titleswiper__right__prev"><i class="iconfont icon-left-arrow"></i></span>

        <span class="kanswiper__titleswiper__right__next"><i class="iconfont icon-right-arrow"></i></span>
      </div>
    </div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  let posterAutoPlay

  export default {
    name: 'kan-swiper',

    components: {
      swiper,
      swiperSlide
    },

    data () {
      return {
        // swiper option
        swiperOption: {
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          pagination: {
            el: '.kanswiper__titleswiper__right__page',
            type: 'fraction'
          },
          navigation: {
            nextEl: '.kanswiper__titleswiper__right__next',
            prevEl: '.kanswiper__titleswiper__right__prev'
          },
          observer: true,
          observeParents: true,
          simulateTouch: false,
          on: {
            slideChange: this.slideChange.bind(this)
          }
        },
        // 封面
        Poster: [
          {
            _id: 131844459918001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181101/99aff22c2c3d2cf8829d86b98085ba5c.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#004dfd',
            title: 'iOS APP 正式上线',
            desc: '看TV苹果版正式上线'
          },
          {
            _id: 131833269569001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181103/547c6523d841e75074e3a524da5938de.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#000000',
            title: '纸牌屋 第六季',
            desc: '女总统克莱尔或迎来残酷结局'
          },
          {
            _id: 131835447571001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181013/3b98754951ecaac844dfb4e9764ef8e0.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#ecede5',
            title: '创业时代',
            desc: '黄轩杨颖还原热血创业史'
          },
          {
            _id: 131842501252001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181102/54af108ed0c9db506e9e7da5d3d06435.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#01102b',
            title: '明星大侦探 第四季',
            desc: '逃出无名岛'
          },
          {
            _id: 131824769803001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20180921/936aabc092476d8a3b8f63b2d313acbc.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#02487c',
            title: '看TV电视客户端正式上线啦！',
            desc: '海外华人首个自己的电视客户端'
          },
          {
            _id: 131832658268001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181018/687f31d0c8621939d13732faaf5173b6.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#b7f4ec',
            title: '小谢尔顿 第二季',
            desc: '孤单却不孤独的成长'
          },
          {
            _id: 131831745060001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20180925/dc6ae87abe578d03883a87fb2c8d833d.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#4385a8',
            title: '生活大爆炸 第十二季',
            desc: '每个人都有了自己的归宿'
          },
          {
            _id: 131828140956001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181024/aa1209ddcd6ae59ef35ab6ad63bf63b5.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#f1bfc8',
            title: '双世宠妃2',
            desc: '坦诚夫妇甜蜜相吻'
          },
          {
            _id: 131828144549001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181015/872b4368ec1f8636d97db01137e92679.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#d6e7fb',
            title: '凉生,我们可不可以不忧伤',
            desc: '钟汉良马天宇孙悦三角虐恋'
          },
          {
            _id: 131845200066001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181106/49c4927a00ec59fa7e45351167c6a691.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#030504',
            title: '吐槽大会 第三季',
            desc: '王力宏脱鞋露破洞袜'
          },
          {
            _id: 131827240687001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181102/f4d15b62bcb5eda082b8c7b43b36cdcb.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#0b0600',
            title: '奇葩说 第五季',
            desc: '首位老奇葩遭淘汰离场'
          },
          {
            _id: 131844459918012,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181225/9866da47d63aaebcb4c56d14fee5d5e6.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#e7d6bd',
            title: '知否知否应是绿肥红瘦',
            desc: '赵丽颖冯绍峰夫妻档撒糖'
          },
          {
            _id: 131844459918013,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181218/38e166b8d3566ffe758edaafc7d6a21a.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#000000',
            title: '影（高清版）',
            desc: '邓超孙俪夫妇联手战斗'
          }
        ],
        // 每个轮播页的封面个数
        numberInSingleSlide: 5,
        // 当前轮播页的index
        currentSlideIndex: 0,
        // 当前封面在轮播页的index
        currentPosterInSlideIndex: 0,
        // 当前封面的图片地址
        currentPosterSrc: ''
      }
    },

    computed: {
      // swiper
      swiper () {
        return this.$refs.kanSwiper.swiper
      },

      // 当前封面在Poster中的index
      currentPosterIndex: function () {
        return this.numberInSingleSlide * this.currentSlideIndex + this.currentPosterInSlideIndex
      },

      // 所有轮播图页数
      totalSlideNumber: function () {
        return this.swiper.slides.length
      },

      // 最后一页的封面个数
      numberInLastSingleSlide: function () {
        return this.Poster.length - (this.numberInSingleSlide * (this.swiper.slides.length - 1))
      }
    },

    mounted () {
      // 初始化每个轮播页的封面个数
      this.setNumberInSingleSlide()

      // 初始化封面图
      this.currentPosterSrc = this.Poster[0].cover
      this.Poster[0].active = true

      // 自动轮播
      posterAutoPlay = setInterval(() => {
        this.posterAutoPlayFunction()
      }, 5000)

      // this.swiper.slideNext()
      // this.swiper.slidePrev()
    },

    methods: {
      // 设置每个轮播页的封面个数
      setNumberInSingleSlide () {
        this.$set(this.$data, 'numberInSingleSlide', parseInt(window.$('.kanswiper__titleswiper__left').eq(0).width() / 120))
      },

      // 监听轮播页的宽度
      handleResize () {
        this.setNumberInSingleSlide()
      },

      // 轮播页切换监听
      slideChange () {
        // 实时更新当前轮播图index
        this.currentSlideIndex = this.swiper.activeIndex
        this.setPoster(this.Poster[this.currentSlideIndex * this.numberInSingleSlide])
      },

      // swiper
      hoverSwiper (event, item) {
        // 切换封面图
        this.currentPosterSrc = item.cover
        // 更新当前封面图在轮播页的idnex
        this.currentPosterInSlideIndex = parseInt(event.currentTarget.getAttribute('data-index'))
        var _this = this
        this.$nextTick(() => {
          this.Poster.forEach(function (posterItem) {
            _this.$set(posterItem, 'active', false)
          })
          this.$set(item, 'active', true)
        })
      },

      // swiper
      leaveSwiper (event, item) {},

      // 封面
      hoverPoster () {
        clearInterval(posterAutoPlay)
      },

      // 封面
      leavePoster () {
        posterAutoPlay = setInterval(() => {
          this.posterAutoPlayFunction()
        }, 5000)
      },

      // 轮播
      posterAutoPlayFunction () {
        var _this = this
        if (this.currentSlideIndex === this.totalSlideNumber - 1) {
        // 当前在轮播最后一页
          if (this.currentPosterInSlideIndex < this.numberInLastSingleSlide - 1) {
            // 当前封面index
            this.currentPosterInSlideIndex += 1
            this.setPoster(this.Poster[this.currentSlideIndex * this.numberInSingleSlide + this.currentPosterInSlideIndex])
          } else if (this.currentPosterInSlideIndex === this.numberInLastSingleSlide - 1) {
            // 当前封面最后一个
            this.currentPosterInSlideIndex = 0
            this.swiper.slideTo(0)
            this.Poster.forEach(function (posterItem) {
              _this.$set(posterItem, 'active', false)
            })
          }
        } else {
        // 当前在轮播页index
          if (this.currentPosterInSlideIndex < this.numberInSingleSlide - 1) {
            // 当前封面index
            this.currentPosterInSlideIndex += 1
            this.setPoster(this.Poster[this.currentSlideIndex * this.numberInSingleSlide + this.currentPosterInSlideIndex])
          } else if (this.currentPosterInSlideIndex === this.numberInSingleSlide - 1) {
            // 当前封面最后一个
            this.currentPosterInSlideIndex = 0
            this.swiper.slideNext()
            this.Poster.forEach(function (posterItem) {
              _this.$set(posterItem, 'active', false)
            })
          }
        }
      },

      // 设置active、封面
      setPoster (target) {
        this.$nextTick(() => {
          var _this = this
          this.Poster.forEach(function (posterItem) {
            _this.$set(posterItem, 'active', false)
          })
          this.$set(target, 'active', true)
          this.currentPosterSrc = target.cover
        })
      }
    },

    watch: {
      numberInSingleSlide: function (val) {
        // 宽度变化时，轮播返回第一页
        this.swiper.slideTo(0)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .swiper-slide {
    transition-duration: 0s !important;
  }

  @media screen and (max-width: 1314px) {
    .kanswiper__titleswiper__left {
      width: 600px;
    }

    .kanswiper__poster__img {
      height: 258px;
    }
  }

  @media screen and (max-width: 1509px) and (min-width: 1315px) {
    .kanswiper__titleswiper__left {
      width: 795px;
    }

    .kanswiper__poster__img {
      height: 258px;
    }
  }

  @media screen and (max-width: 1704px) and (min-width: 1510px) {
    .kanswiper__titleswiper__left {
      width: 990px;
    }

    .kanswiper__poster__img {
      height: 313.69px;
    }
  }

  @media screen and (max-width: 1919px) and (min-width: 1705px) {
    .kanswiper__titleswiper__left {
      width: 1185px;
    }

    .kanswiper__poster__img {
      height: 368.55px;
    }
  }

  @media screen and (min-width: 1920px) {
    .kanswiper__titleswiper__left {
      width: 1400px;
    }

    .kanswiper__poster__img {
      height: 429.03px;
    }
  }

  .kanswiper {

    .kanswiper__poster {
      width: 100%;
      margin-bottom: -34px;

      .kanswiper__poster__img {
        width: 100%;
        object-fit: cover;
      }
    }
  
    .kanswiper__titleswiper {
      display: flex;
      justify-content: space-between;
      background:rgba(0, 0, 0, .3);
      z-index: 0;
      position: relative;

      .kanswiper__titleswiper__left {
    
        .kanswiper__titleswiper__ul {
          font-size: 0;
          text-align: left;
    
          li {
            display: inline-block;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;
            white-space: nowrap;
            font-size: 14px;
            height: 34px;
            line-height: 34px;
            padding: 0 10px;
            cursor: pointer;
          }

          li.active {
            color: $blue;
          }
        }
      }
  
      .kanswiper__titleswiper__right {
        width: 125px;
        flex-shrink: 0;
        height: 34px;
        padding: 8px 0;
        font-size: 0;

        span {
          display: inline-block;
          vertical-align: top;
          width: unset;
          line-height: 18px;
          height: 18px;
          margin: 0 6px;
        }

        .kanswiper__titleswiper__right__page {
          font-size: 12px;
        }

        .kanswiper__titleswiper__right__prev, .kanswiper__titleswiper__right__next {
          cursor: pointer;
          outline: none;

          &:hover {
            color: $blue;
          }

          i {
            font-size: 10px;
          }
        }
      }
    }
  }
</style>

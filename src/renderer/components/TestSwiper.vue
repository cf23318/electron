<template>
  <div class="test-wapper" :style="{width: `${(itemWidth * maxNumber) + 145}px`}">
    <img class="test-pic" :src="topimg[0].cover" alt="">

    <div class="test-control-wapper">
      <div class="test-list-wapper" :style="{width: `${itemWidth * maxNumber}px`}">
        <div class="test-list-container" :style="{left: left}">
          <div
            class="test-list-item"
            v-for="(info, listIndex) in topimg"
            :key="info._id"
            :class="{active: index === listIndex}"
            :style="{width: `${itemWidth}px`}"
            v-text="info.title"
          ></div>
        </div>
      </div>

      <div class="test-control">
        <div class="test-prve" @click="prve">prve</div>
        <div class="test-next" @click="next">next</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'test-swiper',

    data () {
      return {
        index: 0,
        maxNumber: 5,
        itemWidth: 120,
        topimg: [
          {
            _id: 131844459918001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181101/99aff22c2c3d2cf8829d86b98085ba5c.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#004dfd',
            title: '1',
            desc: '看TV苹果版正式上线'
          },
          {
            _id: 131833269569001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181103/547c6523d841e75074e3a524da5938de.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#000000',
            title: '2',
            desc: '女总统克莱尔或迎来残酷结局'
          },
          {
            _id: 131835447571001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181013/3b98754951ecaac844dfb4e9764ef8e0.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#ecede5',
            title: '3',
            desc: '黄轩杨颖还原热血创业史'
          },
          {
            _id: 131842501252001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181102/54af108ed0c9db506e9e7da5d3d06435.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#01102b',
            title: '4',
            desc: '逃出无名岛'
          },
          {
            _id: 131824769803001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20180921/936aabc092476d8a3b8f63b2d313acbc.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#02487c',
            title: '5',
            desc: '海外华人首个自己的电视客户端'
          },
          {
            _id: 131832658268001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181018/687f31d0c8621939d13732faaf5173b6.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#b7f4ec',
            title: '6',
            desc: '孤单却不孤独的成长'
          },
          {
            _id: 131831745060001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20180925/dc6ae87abe578d03883a87fb2c8d833d.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#4385a8',
            title: '7',
            desc: '每个人都有了自己的归宿'
          },
          {
            _id: 131828140956001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181024/aa1209ddcd6ae59ef35ab6ad63bf63b5.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#f1bfc8',
            title: '8',
            desc: '坦诚夫妇甜蜜相吻'
          },
          {
            _id: 131828144549001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181015/872b4368ec1f8636d97db01137e92679.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#d6e7fb',
            title: '9',
            desc: '钟汉良马天宇孙悦三角虐恋'
          },
          {
            _id: 131845200066001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181106/49c4927a00ec59fa7e45351167c6a691.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#030504',
            title: '10',
            desc: '王力宏脱鞋露破洞袜'
          },
          {
            _id: 131827240687001,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181102/f4d15b62bcb5eda082b8c7b43b36cdcb.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#0b0600',
            title: '11',
            desc: '首位老奇葩遭淘汰离场'
          },
          {
            _id: 131844459918012,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181225/9866da47d63aaebcb4c56d14fee5d5e6.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#e7d6bd',
            title: '12',
            desc: '赵丽颖冯绍峰夫妻档撒糖'
          },
          {
            _id: 131844459918013,
            link: 'www.baidu1.com',
            cover: 'http://fscdn1.ytbbs.tv/2018/tv/20181218/38e166b8d3566ffe758edaafc7d6a21a.jpg?x-oss-process=image/resize,w_3000,h_844/sharpen,100/quality,Q_100',
            background: '#000000',
            title: '13',
            desc: '邓超孙俪夫妇联手战斗'
          }
        ]
      }
    },

    computed: {
      left () {
        return `${Math.floor(this.index / this.maxNumber) * -100}%`
      }
    },

    mounted () {
      this.init()

      window.addEventListener('resize', (event) => {
        console.log(window.innerWidth, window.innerHeight)

        let width = window.innerWidth

        if (width > 1300) {
          this.maxNumber = 6
        } else {
          this.maxNumber = 5
        }
      })
    },

    methods: {
      init () {
        // setInterval(() => {
        //   this.next()
        // }, 1000)
      },

      handleIndex (num) {
        let newIndex = this.index + num

        if (newIndex < 0) {
          newIndex = this.topimg.length - 1
        } else if (newIndex >= this.topimg.length) {
          newIndex = 0
        }

        this.index = newIndex
      },

      prve () {
        this.handleIndex(-1)
      },

      next () {
        this.handleIndex(1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .test-wapper {
    position: relative;
    // width: 725px;
    height: 224px;

    .test-pic {
      width: 100%;
      height: 100%;
    }

    .test-control-wapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;

      .test-list-wapper {
        position: relative;
        height: 36px;
        line-height: 36px;
        overflow: hidden;

        .test-list-container {
          position: absolute;
          left: 0;
          display: flex;
          flex-wrap: nowrap;
          width: 100%;
          
          .test-list-item {
            flex-shrink: 0;
            font-size: 12px;
            cursor: pointer;
            @include notExceed();
  
            &.active, &:hover {
              background: #ccc;
            }
          }
        }
      }

      .test-control {
        position: absolute;
        right: 0;
        top: 0;
        flex-shrink: 0;
        display: flex;
        justify-content: flex-end;
        width: 125px;
        height: 36px;
        line-height: 36px;

        & > div {
          width: 50px;
          text-align: center;
          cursor: pointer;

          &:hover {
            background: #ccc;
          }
        }
      }
    }
  }
</style>

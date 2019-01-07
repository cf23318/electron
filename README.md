# electron-vue

> An electron-vue project

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev
(dev 之前需要先run build一下，以编译些配置文件)

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

使用vuex-electron开启createSharedMutations(数据共享时)，commit明令将被禁用，promise功能也将无法使用(通过中央广播的形式所以无法接受promise)，所以请使用watch来监听数据的变更从而完成回调


调试
electron-builder
 cross-env DEBUG=electron-builder:*
"build": "node --max_old_space_size=4096 .electron-vue/build.js && cross-env DEBUG=electron-builder:* electron-builder",


设置 publish.provider 为 generic，手动发布
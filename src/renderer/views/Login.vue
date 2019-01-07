<template>
  <div class="login">
    <window-action system="mac" :isPopup="true"></window-action>
    <window-action system="win" :isPopup="true"></window-action>
    
    <div class="login__title" v-text="title"></div>

    <b-input-group class="login__layout">
      <template v-if="type === 'email'">
        <b-form-input class="login__email transparent" v-model="email" type="text" placeholder="请输入邮箱账号"></b-form-input>
      </template>

      <template v-if="type === 'phone'">
        <b-dropdown class="login__area-code__wrapper" no-caret>
          <template slot="button-content">
            <div class="login__area-code" v-text="`+${areaCode}`"></div>
          </template>

          <b-dropdown-item @click="changeAreaCode('61')">+61</b-dropdown-item>
          <b-dropdown-item @click="changeAreaCode('86')">+86</b-dropdown-item>
          <b-dropdown-item @click="changeAreaCode('64')">+64</b-dropdown-item>
        </b-dropdown>

        <b-form-input class="login__phone transparent" v-model="phone" type="text" placeholder="请输入手机号"></b-form-input>
      </template>

      <div class="login__toggle-switch" @click="toggleType" v-text="title"></div>
    </b-input-group>

    <div class="login__layout last">
      <b-form-input class="login__password transparent" v-model="password" type="password" placeholder="请输入密码"></b-form-input>
    </div>

    <div class="login__forget-password">
      <span class="login__forget-password-text" @click="$electron.shell.openExternal('https://github.com')">忘记密码</span>
    </div>

    <div class="login__layout2">
      <b-button size="k-lg" variant="primary">登录</b-button>
      <b-button size="k-lg" variant="outline-primary" @click="$electron.shell.openExternal('https://github.com')">注册</b-button>
    </div>
  </div>
</template>

<script>
  import WindowAction from 'components/WindowAction.vue'

  export default {
    name: 'login',

    components: {
      WindowAction
    },

    data () {
      return {
        type: 'phone', // phone email

        email: '1624689089@qq.com',
        areaCode: '61',
        phone: '18166004682',
        password: ''
      }
    },

    computed: {
      title () {
        return this.type === 'email' ? '手机登录' : '邮箱登录'
      }
    },

    methods: {
      toggleType () {
        this.type = this.type === 'phone' ? 'email' : 'phone'
      },
      changeAreaCode (areaCode) {
        this.areaCode = areaCode
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background: #F8F8F8;
    color: #333333;

    .login__title {
      padding: 40px 0 28px 0;
      height: 94px;
      line-height: 24px;
      border-left: 30px solid transparent;
      margin-right: 30px;
      text-align: center;
      font-size: 18px;
      -webkit-app-region: drag;
    }

    .login__layout {
      width: 260px;
      height: 38px;
      line-height: 38px;
      background: #EFEFEF;
      border-radius: 4px;
      margin: 0 auto 10px;
      font-size: 12px;

      &.last {
        margin-bottom: 8px;
      }
    }

    .b-dropdown.login__area-code__wrapper {
      line-height: 1.5;
      
      /deep/ .btn {
        padding: 0;
        background: transparent;
        border-color: transparent;
        box-shadow: none;
      }

      .login__area-code {
        flex-shrink: 0;
        position: relative;
        width: 50px;
        line-height: 38px;
        border-radius: 4px 0 0 4px;
        text-align: center;
        color: #333333;
        font-size: 12px;

        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          width: 1px;
          height: 20px;
          transform: translate(0, -10px);
          background: #999999;
        }
      }
    }

    .login__email, .login__phone {
      line-height: 38px;
      padding: 0 10px 0 7px;
      margin: 0;
      font-size: 12px;
    }

    .login__toggle-switch {
      flex-shrink: 0;
      width: 76px;
      border-radius: 0 4px 4px 0;
      text-align: center;
      cursor: pointer;
    }

    .login__password {
      line-height: 38px;
      padding: 0 10px 0;
      margin: 0;
      font-size: 12px;
    }

    .login__forget-password {
      width: 254px;
      margin: 0 auto;
      text-align: right;
      font-size: 12px;

      .login__forget-password-text {
        cursor: pointer;
      }
    }

    .login__layout2 {
      display: flex;
      justify-content: space-between;
      width: 230px;
      margin: 12px auto 0;
    }
  }
</style>

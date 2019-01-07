'use strict'

import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import Store from 'electron-store'
import { pick } from 'lodash'

import { deepMerge, isMac } from '../main/utils/utils.js'

// 确保只有一个实例在运行
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

export default class AppUpdater {
  constructor () {
    function sendStatusToWindow (text) {
      log.info(text)
      mainWindow.webContents.send('AppUpdater-message', text)
    }

    autoUpdater.on('checking-for-update', () => {
      sendStatusToWindow('Checking for update...')
    })
    autoUpdater.on('update-available', (info) => {
      sendStatusToWindow('Update available.')
    })
    autoUpdater.on('update-not-available', (info) => {
      sendStatusToWindow('Update not available.')
    })
    autoUpdater.on('error', (err) => {
      sendStatusToWindow('Error in auto-updater. ' + err)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
      logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
      logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      sendStatusToWindow(logMessage)
    })
    autoUpdater.on('update-downloaded', (info) => {
      sendStatusToWindow('Update downloaded')
    })

    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

function createWindow () {
  /**
   * 第一次进入应用时重置vuex-electron的持久化储存内容
   * 只允许指定模块的数据被重新读取（如下面的user）
   * 其他数据将被抛弃（如setting内的数据将被抛弃）
   */
  const vuexElectronStore = new Store({ name: 'vuex' })
  const vuexStore = vuexElectronStore.get('state', {})
  console.log(JSON.stringify(vuexStore))
  // store的模块
  const newVuexStore = pick(vuexStore, [
    'user'
  ])
  console.log(JSON.stringify(newVuexStore))
  vuexElectronStore.set('state', newVuexStore)

  /**
   * Initial window options
   */
  const options = {
    title: 'kantv',
    width: 1128,
    height: 720,
    minWidth: 1128,
    minHeight: 720,
    show: false,
    frame: false,
    backgroundColor: '#323334'
  }

  if (isMac) {
    deepMerge(options, {
      transparent: true
    })
  }

  if (process.env.NODE_ENV === 'development') {
    deepMerge(options, {
      webPreferences: {webSecurity: false}
    })
  }

  mainWindow = new BrowserWindow(options)

  mainWindow.loadURL(winURL)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
    } else {
      mainWindow.show()
      mainWindow.focus()
      mainWindow.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater()

  // 用于广播actions。详情参考vuex-electron
  require('../renderer/store/index')
  require('./videoWindow')
  require('./downloadVideo')
  require('./downloadVideoWindow')
  require('./loginWindow')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

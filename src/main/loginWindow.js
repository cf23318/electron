import { ipcMain, BrowserWindow } from 'electron'
import { OPEN_LOGIN } from './ipcTypes'

let currentLoginWindow = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

ipcMain.on(OPEN_LOGIN, (event) => {
  createLogin()
})

function createLogin () {
  if (!currentLoginWindow) {
    // 为空处理

    const options = {
      title: 'kantv',
      width: 500,
      height: 330,
      resizable: false,
      show: false,
      frame: false,
      backgroundColor: '#F8F8F8',
      parent: BrowserWindow.getFocusedWindow()
    }

    currentLoginWindow = new BrowserWindow(options)

    currentLoginWindow.loadURL(`${winURL}#/login`)

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    currentLoginWindow.webContents.on('did-finish-load', () => {
      if (!currentLoginWindow) {
        throw new Error('"currentLoginWindow" is not defined')
      }

      currentLoginWindow.show()
      currentLoginWindow.focus()
      currentLoginWindow.openDevTools()
    })

    currentLoginWindow.on('closed', () => {
      currentLoginWindow = null
    })
  }
}

// createLogin()

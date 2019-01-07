import { ipcMain, BrowserWindow } from 'electron'
import { PLAYER__OPEN_DOWNLOAD } from './ipcTypes'

let currentDownloadVideoWindow = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

ipcMain.on(PLAYER__OPEN_DOWNLOAD, (event, args) => {
  createDownloadPage(args)
})

function createDownloadPage ({ id }) {
  if (!id) throw new Error('create download page error: id does not exist!')

  if (!currentDownloadVideoWindow) {
    // 为空处理

    const options = {
      title: 'kantv',
      width: 500,
      height: 360,
      resizable: false,
      show: false,
      frame: false,
      backgroundColor: '#323334',
      parent: BrowserWindow.getFocusedWindow()
    }

    currentDownloadVideoWindow = new BrowserWindow(options)

    currentDownloadVideoWindow.loadURL(`${winURL}#/downloadWindow/${id}`)

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    currentDownloadVideoWindow.webContents.on('did-finish-load', () => {
      if (!currentDownloadVideoWindow) {
        throw new Error('"currentDownloadVideoWindow" is not defined')
      }

      currentDownloadVideoWindow.show()
      currentDownloadVideoWindow.focus()
      currentDownloadVideoWindow.openDevTools()
    })

    currentDownloadVideoWindow.on('closed', () => {
      currentDownloadVideoWindow = null
    })
  }
}

// createDownloadPage({ id: '001' })

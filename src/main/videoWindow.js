import { ipcMain, BrowserWindow } from 'electron'
import { PLAYER__PRELOAD_PLAYER, PLAYER__OPEN_PLAYER } from './ipcTypes'
import { deepMerge } from '../main/utils/utils.js'

let currentVideoWindow = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

ipcMain.on(PLAYER__PRELOAD_PLAYER, () => {
  createPlayerPage({ id: 'test001', partId: 'test001', preload: true })
})

ipcMain.on(PLAYER__OPEN_PLAYER, (event, args) => {
  createPlayerPage(args)
})

function createPlayerPage ({ id, partId, preload }) {
  if (!id) throw new Error('create player page error: id does not exist!')
  if (!partId) throw new Error('create player page error: partId does not exist!')

  id = id.toString()
  partId = partId.toString()

  if (!currentVideoWindow) {
    // 为空处理

    const options = {
      width: 1360,
      height: 750,
      minWidth: 720,
      minHeight: 414,
      show: false,
      frame: false,
      backgroundColor: '#323334'
    }

    if (process.env.NODE_ENV === 'development') {
      deepMerge(options, {
        webPreferences: {webSecurity: false}
      })
    }

    currentVideoWindow = new BrowserWindow(options)

    currentVideoWindow.loadURL(`${winURL}#/player/${id}/${partId}`)

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    currentVideoWindow.webContents.on('did-finish-load', () => {
      if (!currentVideoWindow) {
        throw new Error('"currentVideoWindow" is not defined')
      }

      currentVideoWindow.show()
      currentVideoWindow.focus()
      currentVideoWindow.openDevTools()
    })

    currentVideoWindow.on('closed', () => {
      currentVideoWindow = null
    })
  } else {
    currentVideoWindow.webContents.send('changeVideo', ({ id, partId }))
  }
}

// createPlayerPage({ id: '001', partId: '002' })

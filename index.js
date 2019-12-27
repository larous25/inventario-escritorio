const Stock = require('./models/stocktaking')
Stock.createtables()

const electron = require('electron')
const { app, BrowserWindow } = electron

const path = require('path')
const url = require('url')

// let icon = os.platform() === 'win32' ? 'tray-icon.ico' : 'tray-icon.png';
// tray = new Tray(path.join(__dirname, 'assets', 'icons', icon));
// tray.setToolTip('');

app.on('ready', () => {
  const width = 900; const height = 700
  const win = new BrowserWindow({ width, height, center: true })

  if (process.env.NODE_ENV) {
    win.webContents.openDevTools()
  }

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))

  // tray.on('click', () => {
  // 	win.isVisible() ? win.hide() : win.show();
  // });

  win.on('closed', () => {
    global.win = null
    app.quit()
  })
})

app.on('before-quit', () => {
  Stock.close()
})

/*

import { app, dialog } from 'electron'

function relaunchApp (win) {
  dialog.showMessageBox(win, {
    type: 'error',
    title: 'Platzipics',
    message: 'Ocurrió un error inesperado, se reiniciará el aplicativo'
  }, () => {
    app.relaunch()
    app.exit(0)
  })
}

function setupErrors (win) {
  win.webContents.on('crashed', () => {
    relaunchApp(win)
  })

  win.on('unresponsive', () => {
    dialog.showMessageBox(win, {
      type: 'warning',
      title: 'Platzipics',
      message: 'Un proceso está tardando demasiado, puede esperar o reiniciar el aplicativo manualmente'
    })
  })

  process.on('uncaughtException', () => {
    relaunchApp(win)
  })
}

*/

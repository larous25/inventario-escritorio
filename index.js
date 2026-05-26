const path = require('path')

const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

const Stock = require('./models/stocktaking')

Stock.createtables()

let win = null

function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    center: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  win.loadFile('index.html')

  win.on('closed', () => {
    win = null
  })
}

/*
|--------------------------------------------------------------------------
| IPC API
|--------------------------------------------------------------------------
| Aquí vive toda la lógica de backend:
| - sqlite
| - filesystem
| - electron APIs
|--------------------------------------------------------------------------
*/

// PRODUCTS

ipcMain.handle('products:get', async (event, options) => {
  return await new Promise((resolve, reject) => {
    Stock.gettable(options, (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      resolve(rows)
    })
  })
})

ipcMain.handle('products:count', async (event, table) => {
  return await new Promise((resolve, reject) => {
    Stock.getcounttable(table, (err, quantity) => {
      if (err) {
        reject(err)
        return
      }

      resolve(quantity)
    })
  })
})

ipcMain.handle('products:insert', async (event, product) => {
  return await new Promise((resolve, reject) => {
    Stock.insertproduct(product, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

ipcMain.handle('products:update', async (event, product) => {
  return await new Promise((resolve, reject) => {
    Stock.updateproduct(product, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

ipcMain.handle('products:remove', async (event, productId) => {
  return await new Promise((resolve, reject) => {
    Stock.removeproduct(productId, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

// SALES

ipcMain.handle('sales:get', async (event, options) => {
  return await new Promise((resolve, reject) => {
    Stock.gettable(options, (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      resolve(rows)
    })
  })
})

ipcMain.handle('sales:insert', async (event, data) => {
  return await new Promise((resolve, reject) => {
    Stock.insertsale(data, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

ipcMain.handle('sales:update', async (event, data) => {
  return await new Promise((resolve, reject) => {
    Stock.updatesale(data, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

ipcMain.handle('sales:remove', async (event, saleId) => {
  return await new Promise((resolve, reject) => {
    Stock.removesale(saleId, err => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
})

// CUSTOM SQL

ipcMain.handle('db:custom', async (event, sql) => {
  return await new Promise((resolve, reject) => {
    Stock.custom(sql, (err, rows) => {
      if (err) {
        reject(err)
        return
      }

      resolve(rows)
    })
  })
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  Stock.close()
})
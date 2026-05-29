const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // --- Productos ---
  getProducts: (options) => ipcRenderer.invoke('products:get', options), 
  getProductsCount: (table) => ipcRenderer.invoke('products:count', table),
  insertProduct: (product) => ipcRenderer.invoke('products:insert', product),
  updateProduct: (product) => ipcRenderer.invoke('products:update', product),
  removeProduct: (productId) => ipcRenderer.invoke('products:remove', productId),

  // --- Ventas ---
  getSales: (options) => ipcRenderer.invoke('sales:get', options),
  insertSale: (data) => ipcRenderer.invoke('sales:insert', data),
  updateSale: (data) => ipcRenderer.invoke('sales:update', data),
  removeSale: (saleId) => ipcRenderer.invoke('sales:remove', saleId),

  // --- Utilidades ---
  runCustomSQL: (sql) => ipcRenderer.invoke('db:custom', sql),
  showMessageBox: (options) => ipcRenderer.invoke('dialog:showMessageBox', options),

  // ... tus otros métodos
  getProductsBySale: (saleId) => ipcRenderer.invoke('sales:get-products', saleId),

})
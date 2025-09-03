const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openLRCFile: () => ipcRenderer.invoke('dialog:openLRCFile'),
  saveLRCFile: (content) => ipcRenderer.invoke('dialog:saveLRCFile', content)
});

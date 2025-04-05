const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  // 注册全局快捷键
  globalShortcut.register('Control+Alt+Insert', () => {
    mainWindow.webContents.send('toggle-chat')
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 安全相关配置
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event) => {
    event.preventDefault()
  })
})
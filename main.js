// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const ExcelExporter = require('./src/js/export/excelExporter')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, printWindow, splashScreen
let menu 
let pdfPrinter = "Microsoft Print to PDF"

// Development Mode
const is_dev_mode = process.argv[2] === '--dev';
if (is_dev_mode) console.log("Developer Mode on")

function createAppWindows() {
  createSplashscreen()
  setTimeout( () => {
    createWindow()
  }, 1000)
}

function createSplashscreen() {
  splashScreen = new BrowserWindow({ 
    width: 550,
    height: 300,
    frame: false
  })
  splashScreen.setIgnoreMouseEvents(true)
  splashScreen.loadFile('./src/html/splashscreen.html')
  splashScreen.once('ready-to-show', () => {
    splashScreen.show()
  })
  splashScreen.on('closed', () => {
    splashScreen = null
  })
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      devTools: is_dev_mode
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('close', (event) => {
    event.preventDefault()
    let response = mainWindow.webContents.send('quit','Close the current File then quit')
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    setTimeout(()=>{
      splashScreen.destroy()
      mainWindow.maximize()
      mainWindow.show()
    }, 1000)
  })

  // Menu
  menu = Menu.buildFromTemplate([
    {
      label: 'Datei',
      submenu: [
        { id: 'new', label:'Neu', accelerator: 'CmdOrCtrl+N', click() { newFile() } },
        { type:'separator' },
        { id: 'open', label:'Öffnen', accelerator: 'CmdOrCtrl+O', click() { openFile() } },
        { type:'separator' },
        { id: 'save', label:'Speichern', accelerator: 'CmdOrCtrl+S', click() { saveFile() } },
        {
          id: 'saveas',
          label:'Speichern unter...',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+S';
            else
              return 'Ctrl+Shift+S';
          })(),
          click() { saveFileAs() }
        },
        { type:'separator' },
        { 
          id: 'export-excel',
          label:'Exportieren nach Excel', 
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+E';
            else
              return 'Ctrl+Shift+E';
          })(),
          click() { exportFileAsXlsx() } 
        },
        { 
          id: 'export-pdf',
          label:'Exportieren nach PDF',
          visible: isPdfPrinterAvailable(),
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+P';
            else
              return 'Ctrl+Shift+P';
          })(),
          click() { exportFileAsPdf() } 
        },
        { type:'separator' },
        { id: 'print', label:'Drucken', accelerator: 'CmdOrCtrl+P', click() { printFile() } },
        { type:'separator' },
        { id: 'close', label:'Schließen', accelerator: 'CmdOrCtrl+W', click() { closeFile() } },
        { type:'separator' },
        { id: 'quit', label:'Beenden', role: 'quit'
        }
      ]
    },
    {
      label: 'Bearbeiten',
      submenu: [
        { id: 'undo', label: 'Rückgängig', accelerator: 'CmdOrCtrl+Z', click() { undo() }, enabled: false },
        { id: 'redo', label: 'Wiederholen', accelerator: 'CmdOrCtrl+Y', click() { redo() }, enabled: false }
      ]
    },
    {
      label: 'Ansicht',
      submenu: [
        { id: 'reload', label: 'Neu laden', role: 'reload' },
        { type: 'separator' },
        { id: 'resetzoom', label: 'Zoom zurücksetzen', role: 'resetzoom' },
        { id: 'zoomin', label: 'Vergrößern', role: 'zoomin' },
        { id: 'zoomout', label: 'Verkleinern', role: 'zoomout' },
        { type: 'separator' },
        { id: 'fullscreen', label: 'Vollbild', role: 'togglefullscreen' },
      ]
    }
  ])
  Menu.setApplicationMenu(menu);

  if ( is_dev_mode ) {
    devmenu = Menu.buildFromTemplate([
      { 
        id: 'dev-menu-item',
        label: 'Developer',
        submenu: [
          {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
              if (process.platform === 'darwin')
                return 'Alt+Command+I';
              else
                return 'Ctrl+Shift+I';
            })(),
            role: 'toggleDevTools'
          }
        ]
      }
    ])
    menu.append(devmenu.getMenuItemById('dev-menu-item'))
    Menu.setApplicationMenu(menu);
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  if ( is_dev_mode ) mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createAppWindows()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createAppWindows()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/**
 * FUNCTIONS
 */
function newFile() {
  let response = mainWindow.webContents.send('newFile','Create a new File')
}

function closeFile() {
  let response = mainWindow.webContents.send('closeFile','Close the current File')
}

function saveFile() {
  let response = mainWindow.webContents.send('saveFile','Save the current File')
}

function saveFileAs() {
  let response = mainWindow.webContents.send('saveFileAs','Save the current File')
}

function openFile() {
  let response = mainWindow.webContents.send('openFile','Open a File')
}

function exportFileAsXlsx() {
  let response = mainWindow.webContents.send('exportAsExcel','Export as .xlsx file')
}

function exportFileAsPdf() {
  mainWindow.webContents.send('showProgressbar', {type: 'danger', textcolor: 'white', message: 'PDF Export wird ausgeführt...', fullscreen: false, timeout: -1 })
  printFile(
    {deviceName: pdfPrinter, silent: true},
    {success: `Die Saisonplanung wurde erfolgreich als PDF exportiert.`, error: `Der PDF Export ist fehlgeschlagen oder wurde abgebrochen!` }
  )
}

function printFile(printOptions={}, messages={success: `Saisonplanung erfolgreich gedruckt`, error: `Der Druck ist fehlgeschlagen!` } ) {
  printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })
  printWindow.loadFile('index.html')
  printWindow.once('ready-to-show', () => {
    setTimeout(()=>{
      printWindow.webContents.print(printOptions, function(success, errorType) {
        mainWindow.webContents.send('hideProgressbar', "")
        if ( ! success ) {
          if (errorType !== 'cancelled') {
            mainWindow.webContents.send('showAlert', {type: 'danger', message: messages.error, timeout: -1 })
          }
        } else {
          mainWindow.webContents.send('showAlert', {type: 'success', message: messages.success })
        }
        printWindow.close()
      })
    },1500) // wait until window is fully loaded
  })
}

function undo() {
  let response = mainWindow.webContents.send('undo','Take last action back')
}

function redo() {
  let response = mainWindow.webContents.send('redo','Redo last action')
}

function isPdfPrinterAvailable() {
  return mainWindow.webContents.getPrinters().reduce((total, current) => { 
    return total || ( current.name === pdfPrinter ) 
  }, false);
}

function enableFileMenu(enabled=true){
  menu.getMenuItemById('new').enabled = enabled
  menu.getMenuItemById('open').enabled = enabled
  menu.getMenuItemById('save').enabled = enabled
  menu.getMenuItemById('saveas').enabled = enabled
  menu.getMenuItemById('export-excel').enabled = enabled
  menu.getMenuItemById('export-pdf').enabled = enabled
  menu.getMenuItemById('print').enabled = enabled
  menu.getMenuItemById('close').enabled = enabled
}

/**
 * IPC EVENTS
 */
ipcMain.handle('saveFile', (event, args) => {
  saveFile()
  return true
})

ipcMain.handle('openFile', (event, args) => {
  openFile()
  return true
})

ipcMain.handle('setUndoEnabled', (event, args) => {
  menu.getMenuItemById('undo').enabled = args
  return true
})

ipcMain.handle('setRedoEnabled', (event, args) => {
  menu.getMenuItemById('redo').enabled = args
  return true
})

ipcMain.on('exportAsExcelReply', (event, args) => {
  ExcelExporter.exportAsXlsx(JSON.parse(args.planung), args.filepath).then((result) => {
    event.reply('exportAsExcelResult', result)
    if (result.success){
      try {
        shell.openItem(args.filepath)
      } catch (e) {
        event.reply('showAlert', {type: 'danger', message: `Datei '${args.filepath} konnte nicht geöffnet werden`, timeout: -1 })
      }
    }
  })
})

ipcMain.on('quitOK', (event, args) => {
  mainWindow.destroy()
  app.quit()
})

ipcMain.on('enableFileMenu', (event, args) => {
  enableFileMenu(args)
})

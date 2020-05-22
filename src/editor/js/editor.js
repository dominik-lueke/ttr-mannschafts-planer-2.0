// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var {remote, ipcRenderer, shell} = require('electron')
var eleapp = remote.app
var path = require('path')
var fs = require('fs')

/**
 * EVENTS FROM MENU
 */

ipcRenderer.on('newFile', (event, args) => {
  app.createNewPlanung()
})

ipcRenderer.on('closeFile', (event, args) => {
  app.closePlanungSave()
})

ipcRenderer.on('saveFile', (event, args) => {
  app.saveFile()
})

ipcRenderer.on('saveFileAs', (event, args) => {
  const planung_json = JSON.parse(app.getPlanungAsJsonString())
  planung_json.saved = true
  const planung_json_save_str = JSON.stringify(planung_json)
  var filepath = saveAsDialog(planung_json)
  if ( filepath ) {
    writePlanungToFile(filepath, planung_json_save_str)
    app.setPlanungFile(filepath)
  }
})

ipcRenderer.on('openFile', (event, args) => {
  var filepath = openDialog()
  if ( filepath && filepath.length == 1 ) {
    app.closePlanungSave().then((result) => {
      if ( result ) {
        openPlanungFromFile(filepath[0])
      }
    })
  }
})

ipcRenderer.on('openFilepath', (event, args) => {
  filepath = [args]
  if ( filepath && filepath.length == 1 ) {
    openPlanungFromFile(filepath[0])
  }
})

ipcRenderer.on('exportAsExcel', (event, args) => {
  var filepath = exportAsXlsxDialog(app.model.planung)
  if ( filepath ) {
    app.showProgressBar('success', 'white', 'Exportiere nach Excel...')
    ipcRenderer.send('exportAsExcelReply', {filepath: filepath, planung: app.model.planung.getPlanungAsJsonString()})
  }
})

ipcRenderer.on('exportAsExcelResult', (event, args) => {
  setTimeout( () => {
    app.hideProgressBar()
    if (args.success){
      app.alert('success', args.message)
    } else {
      app.alertError(args.message)
    }
  }, 1000) // totally silly 1 second timeout to show the progressbar a decent amount of time to the user 
})

ipcRenderer.on('showAlert', (event, args) => {
  app.alert(args.type, args.message, args.timeout)
})

ipcRenderer.on('showProgressbar', (event, args) => {
  app.showProgressBar(args.type, args.textcolor, args.message, args.fullscreen, args.timeout)
})

ipcRenderer.on('hideProgressbar', (event, args) => {
  app.hideProgressBar()
})

ipcRenderer.on('undo', (event, args) => {
  app.undo()
})

ipcRenderer.on('redo', (event, args) => {
  app.redo()
})

ipcRenderer.on('showAboutModal', (event, args) => {
  app.displayAboutModal()
})

ipcRenderer.on('quit', (event, args) => {
  // store current file
  const file = app.planung.file 
  app.closePlanungSave().then((result) => {
    if (result) {
      if (file) {
        localStorage.setItem('localStorageFilepath', file)
      } else {
        localStorage.removeItem('localStorageFilepath')
      }
      ipcRenderer.send('quitOK')
    }
  })
})

/**
 * DIALOGS
 */

saveAsDialog = (planung) => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  const friendly_saison = planung.saison.replace("/","")
  const filepath_suggestion = `Saisonplanung-${planung.verein}-${planung.spielklasse}-${planung.halbserie}-${friendly_saison}.ttsp`
  let options = {
    title: "Speichere Saisonplanung - Tischtennis Mannschafts Planer",
    defaultPath : path.resolve(eleapp.getPath("documents"),filepath_suggestion),
    buttonLabel : "Speichern",
    filters :[
      {name: 'Saisonplanungen', extensions: ['ttsp']},
      {name: 'All Files', extensions: ['*']}
    ]
  }
  return dialog.showSaveDialogSync(window, options)
}

openDialog = () => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  let options = {
    title: "Öffne Saisonplanung - Tischtennis Mannschafts Planer",
    defaultPath : eleapp.getPath("documents"),
    buttonLabel : "Öffnen",
    filters :[
      {name: 'Tischtennis Saisonplanungen', extensions: ['ttsp']}
    ]
  }
  return dialog.showOpenDialogSync(window, options)
}

exportAsXlsxDialog = (planung) => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  const friendly_saison = planung.saison.replace("/","")
  const empty_filepath_suggestion = `Saisonplanung-${planung.verein}-${planung.spielklasse}-${planung.halbserie}-${friendly_saison}.xslx`
  const filepath_suggestion = planung.file ? planung.file.replace("ttsp","xlsx") : path.resolve(eleapp.getPath("documents"),empty_filepath_suggestion)
  let options = {
    title: "Exportiere Saisonplanung - Tischtennis Mannschafts Planer",
    defaultPath : path.resolve(filepath_suggestion),
    buttonLabel : "Exportieren",
    filters :[
      {name: 'Excel Arbeitsmappen (*.xlsx)', extensions: ['xlsx']}
    ]
  }
  return dialog.showSaveDialogSync(window, options)
}

confirmClosePlanungDialog = () => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  let options = {
    type: "warning",
    title: "Ungespeicherte Änderungen",
    message: "Möchten Sie die Änderungen speichern, die Sie an der aktuellen Planung vorgenommen haben?\n\nIhre Änderungen gehen verloren, wenn Sie diese nicht speichern",
    buttons: ["Speichern", "Nicht speichern", "Abbrechen"],
    cancelId: 2,
  }
  return dialog.showMessageBoxSync(window, options)
}

/**
 * FILE HANDLING
 */

writePlanungToFile = (filepath, planung_json_str) => {
  try {
    fs.writeFileSync(filepath, planung_json_str)
  } catch (err) {
    app.alertError(`An error ocurred creating the file ${filepath}:<br/>${err.message}`)
    return false
  }
  return true
}

openPlanungFromFile = (filepath) => {
  app.showProgressBar("primary","white","",true) // start "loading"
  fs.readFile(filepath, 'utf-8', (err, file_content_str) => {
    if(err){
        app.alertError(`An error ocurred reading the file ${filepath}:<br/>${err.message}`);
        return;
    }
    app.closePlanungSave().then((result) => {
      if (result) {
        app.openPlanung(file_content_str, filepath)
      }
      app.hideProgressBar() // stop "loading"
    })
  });
}

/**
 * Open External URLs
 */
$(document).on('click', 'a[href^="http"]', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});

$(document).on('click', 'a[href^="file://"]', function(event) {
  event.preventDefault()
  shell.openItem(path.resolve(__dirname, this.href.replace('file://','./../../../')))
});

/*
* --------------
*     M V C
* --------------
*/
const app = new Controller()
if (localStorage.getItem('localStorageFilepath')) {
  openPlanungFromFile(localStorage.getItem('localStorageFilepath'))
}
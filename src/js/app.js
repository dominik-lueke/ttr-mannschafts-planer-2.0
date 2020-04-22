// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var {remote, ipcRenderer} = require('electron')
var eleapp = remote.app
var path = require('path')
var fs = require('fs')

/*
* --------------
*     M V C
* --------------
*/
const app = new Controller()

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
  const planung_json = JSON.parse(app.getPlanungAsJsonString())
  // set saved to true in the planung in the file
  planung_json.saved = true
  const planung_json_save_str = JSON.stringify(planung_json)
  if (planung_json.file === "") {
    var filepath = saveAsDialog(planung_json)
    if ( filepath ) {
      writePlanungToFile(filepath, planung_json_save_str)
      app.setPlanungFile(filepath)
    }
  } else {
    writePlanungToFile(planung_json.file, planung_json_save_str)
    app.setPlanungFile(planung_json.file)
  }
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
  app.closePlanungSave().then((result) => {
    if ( result ) {
      var filepath = openDialog()
      if ( filepath && filepath.length == 1 ) {
        openPlanungFromFile(filepath[0])
      }
    }
  })
})

ipcRenderer.on('exportAsExcel', (event, args) => {
  var filepath = exportAsXlsxDialog(app.planung)
  if ( filepath ) {
    app.showProgressBar('success', 'white', 'Exportiere nach Excel...')
    ipcRenderer.send('exportAsExcelReply', {filepath: filepath, planung: app.planung.getPlanungAsJsonString()})
  }
})

ipcRenderer.on('exportAsExcelResult', (event, args) => {
  setTimeout( () => {
    app.hideProgressBar()
    if (args.success){
      app.alert('success', args.message)
    } else {
      app.alert('danger', args.message, -1)
    }
  }, 1000) // totally silly 1 second timeout to show the progressbar a decent amount of time to the user 
})

ipcRenderer.on('showAlert', (event, args) => {
  app.alert(args.type, args.message, args.timeout)
})

ipcRenderer.on('undo', (event, args) => {
  app.undo()
})

ipcRenderer.on('redo', (event, args) => {
  app.redo()
})

/**
 * DIALOGS
 */

saveAsDialog = (planung) => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  const friendly_saison = planung.saison.replace("/","")
  const filepath_suggestion = `Saisonplanung-${planung.verein}-${planung.spielklasse}-${planung.halbserie}-${friendly_saison}.ttr.json`
  let options = {
    title: "Speichere Saisonplanung - Tischtennis Mannschafts Planer",
    defaultPath : path.resolve(eleapp.getPath("documents"),filepath_suggestion),
    buttonLabel : "Speichern",
    filters :[
      {name: 'Saisonplanungen', extensions: ['ttr.json']},
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
      {name: 'Saisonplanungen', extensions: ['ttr.json']},
      {name: 'All Files', extensions: ['*']}
    ]
  }
  return dialog.showOpenDialogSync(window, options)
}

exportAsXlsxDialog = (planung) => {
  const dialog = remote.dialog
  const window = remote.getCurrentWindow();
  const filepath_suggestion = planung.file.replace("ttr.json","xlsx")
  let options = {
    title: "Exportiere Saisonplanung - Tischtennis Mannschafts Planer",
    defaultPath : path.resolve(filepath_suggestion),
    buttonLabel : "Exportieren",
    filters :[
      {name: 'Excel Arbeitsmappen (*.xlsx)', extensions: ['xlsx']},
      {name: 'All Files', extensions: ['*']}
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
  fs.writeFile(filepath, planung_json_str, (err) => {
    if(err){
        app.alert('danger', `An error ocurred creating the file ${file_name}:<br/>${err.message}`, -1)
    }
  })
}

openPlanungFromFile = (filepath) => {
  fs.readFile(filepath, 'utf-8', (err, planung_json_str) => {
    if(err){
        app.alert('danger', `An error ocurred reading the file ${file_name}:<br/>${err.message}`, -1);
        return;
    }
    app.closePlanungSave().then((result) => {
      if (result) {
        app.openPlanungFromJsonString(planung_json_str)
        app.setPlanungFile(filepath)
      }
    })
  });
}
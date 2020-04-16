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
  app.closePlanung()
})

ipcRenderer.on('saveFile', (event, args) => {
  const planung_json_str = app.getPlanungAsJsonString()
  const planung_json = JSON.parse(planung_json_str)
  if (planung_json.file === "") {
    var filepath = saveAsDialog(planung_json)
    if ( filepath ) {
      writePlanungToFile(filepath, planung_json_str)
      app.setPlanungFile(filepath)
    }
  } else {
    writePlanungToFile(planung_json.file, planung_json_str)
    app.setPlanungFile(planung_json.file)
  }
})

ipcRenderer.on('saveFileAs', (event, args) => {
  const planung_json_str = app.getPlanungAsJsonString()
  const planung_json = JSON.parse(planung_json_str)
  var filepath = saveAsDialog(planung_json)
  if ( filepath ) {
    writePlanungToFile(filepath, planung_json_str)
    app.setPlanungFile(filepath)
  }
})

ipcRenderer.on('openFile', (event, args) => {
  var filepath = openDialog()
  if ( filepath && filepath.length == 1 ) {
    openPlanungFromFile(filepath[0])
  }
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

/**
 * FILE HANDLING
 */

writePlanungToFile = (filepath, planung_json_str) => {
  fs.writeFile(filepath, planung_json_str, (err) => {
    if(err){
        alert(`An error ocurred creating the file ${file_name}:` + err.message)
    }
  })
}

openPlanungFromFile = (filepath) => {
  fs.readFile(filepath, 'utf-8', (err, planung_json_str) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }
    app.loadPlanungFromJsonString(planung_json_str)
    app.setPlanungFile(filepath)
  });
}
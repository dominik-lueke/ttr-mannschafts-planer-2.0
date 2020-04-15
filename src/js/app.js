// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

/*
* --------------
*     M V C
* --------------
*/
var {remote} = require('electron')
var ipc = require('electron').ipcRenderer
var elerem = require('electron').remote
var eleapp = elerem.app
var path = require('path')
var fs = require('fs')

const app = new Controller()

ipc.on('newFile', (event, args) => {
  app.createNewPlanung()
})

ipc.on('closeFile', (event, args) => {
  app.closePlanung()
})

ipc.on('saveFile', (event, args) => {
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
  }
})

ipc.on('saveFileAs', (event, args) => {
  const planung_json_str = app.getPlanungAsJsonString()
  const planung_json = JSON.parse(planung_json_str)
  var filepath = saveAsDialog(planung_json)
  if ( filepath ) {
    writePlanungToFile(filepath, planung_json_str)
    app.setPlanungFile(filepath)
  }
  
})

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

writePlanungToFile = (filepath, planung_json_str) => {
  fs.writeFile(filepath, planung_json_str, (err) => {
    if(err){
        alert(`An error ocurred creating the file ${file_name}:` + err.message)
    }
  })
}
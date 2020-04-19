class ExcelExporter {

  constructor(){
    this.xl = require('excel4node')
    this.styles = {}
  }

  exportAsXlsx(planung, filepath) {
    // Create a new instance of a Workbook class
    var wb = new this.xl.Workbook()
    // Add Workbook
    var ws = wb.addWorksheet(`${planung.spielklasse} ${planung.url.halbserie.toUpperCase()} ${planung.saison.replace("/","-")}`)
    // Define the styles
    this._defineStyles(wb,ws)
    // Write Content
    this._writeHeader(planung, ws)
    this._writeMannschaften(planung, ws, 4)
    // Save
    this._saveWorkbook(wb, filepath)
  }

  _writeHeader(planung, ws) {
    // Header
    ws.cell(1,2).string(planung.verein)
    ws.cell(1,3).string(`${planung.halbserie} ${planung.saison}`)
    ws.cell(1,4).string(planung.spielklasse)

    // Table Header
    ws.cell(3,2).string('Mannschaft')
      .style(this.styles.bold)
    ws.cell(3,3).string('Name')
      .style(this.styles.bold)
    ws.cell(3,4).string(`Q-TTR (${planung.ttrwerte.datestring})`)
      .style(this.styles.bold)
      .style(this.styles.align_right)
    ws.cell(3,5).string(`Differenz`)
      .style(this.styles.bold)
  }

  _writeMannschaften(planung, ws, row) {
    var write_to_row = row
    var rows_written = 0
    planung.mannschaften.liste.forEach( mannschaft => {
      rows_written = this._writeMannschaft(planung, mannschaft, ws, write_to_row)
      write_to_row += (rows_written + 2)
    })
    return rows_written
  }

  _writeMannschaft(planung, mannschaft, ws, row) {
    var write_to_row = row
    var rows_written = 0
    // write header
    var header_rows_written = this._writeMannschaftHeader(mannschaft, ws, write_to_row)
    rows_written += header_rows_written
    write_to_row += header_rows_written
    // write spieler
    planung.spieler.getSpielerOfMannschaft(mannschaft.nummer).forEach(spieler => {
      var spieler_rows_written = this._writeSpieler(spieler, ws, write_to_row)
      rows_written += spieler_rows_written
      write_to_row += spieler_rows_written
    })
    return rows_written
  }

  _writeMannschaftHeader(mannschaft, ws, row) {
    var write_to_row = row
    ws.cell(write_to_row,2).string(`${mannschaft.nummer}. ${mannschaft.spielklasse}`)
      .style(this.styles.mannschaft_header)
    ws.cell(write_to_row,3).string(`${mannschaft.liga}`)
      .style(this.styles.mannschaft_header)
    ws.cell(write_to_row,4).string(`${mannschaft.spieltag}`)
      .style(this.styles.mannschaft_header)
    ws.cell(write_to_row,5).string(`${mannschaft.uhrzeit} Uhr`)
      .style(this.styles.mannschaft_header)
    ws.cell(write_to_row,6).string(`${mannschaft.spielwoche}`)
      .style(this.styles.mannschaft_header)
    ws.cell(write_to_row,7).string(`${mannschaft.kommentar}`)
    var rows_written = 1
    return rows_written
  }

  _writeSpieler(spieler, ws, row) {
    var write_to_row = row
    // position
    ws.cell(write_to_row,2).string(`${spieler.position}.`)
      .style(this.styles.align_right)
    // name
    ws.cell(write_to_row,3).string(`${spieler.name}`)
    if (this.styles.color.hasOwnProperty(spieler.farbe)){
      ws.cell(write_to_row,3).style(this.styles.color[spieler.farbe])
    }
    // qttr
    ws.cell(write_to_row,4).number(spieler.qttr)
    // ttr-differenz
    ws.cell(write_to_row,5).number(spieler.ttrdifferenz)
    // bemerkungen from status
    var bemerkung = []
    if (spieler.spv.primary || spieler.spv.secondary > 0) {
      bemerkung.push("SPV")
      ws.cell(write_to_row,6).style(this.styles.color['red'])
    }
    if (spieler.reserve) {
      bemerkung.push("RES")
      ws.cell(write_to_row,3).style(this.styles.color['light'])
    }
    if (spieler.sbe) {
      bemerkung.push("SBE")
    }
    ws.cell(write_to_row,5).string(bemerkung.join(','))
    // kommentar
    ws.cell(write_to_row,7).string(`${spieler.kommentar}`)
    // invalid
    if (spieler.invalid.length > 0){
      ws.cell(write_to_row,2).style(this.styles.invalid_border_left)
      ws.cell(write_to_row,2,write_to_row,6).style(this.styles.invalid_border_top_bottom)
      ws.cell(write_to_row,6).style(this.styles.invalid_border_right)
      ws.cell(write_to_row,3).style(this.styles.color['invalid'])
      ws.cell(write_to_row,3).comment(`Ungültige Reihenfolge\n${spieler.invalid.map( s => `${s.mannschaft}.${s.position} ${s.name} +${s.differenz} TTR-Punkte`).join('\n')}`, { height: '100pt', width: '240pt'})
    }
    var rows_written = 1
    return rows_written
  }

  _saveWorkbook(wb, filepath) {
    wb.write(filepath)
  }

  _defineStyles(wb, ws) {
    // colum width
    ws.column(1).setWidth(1)  // "Margin"
    ws.column(2).setWidth(12) // Verein
    ws.column(3).setWidth(25) // Saison + Spieler-Name
    ws.column(4).setWidth(18) // Spielklasse + QTTR + Spieltag
    ws.column(5).setWidth(10) // Uhrzeit + Differenz
    ws.column(6).setWidth(6)  // Spielwoche + SPV
    ws.column(7).setWidth(25) // Kommentar

    // cell styles
    this.styles = {
      align_right : wb.createStyle({
        alignment: {
          horizontal: 'right'
        }
      }),
      bold : wb.createStyle({
        font: {
          bold: true
        }
      }),
      mannschaft_header : wb.createStyle({
        font: {
          color: '#FFFFFF'
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '#212529'
        }
      }),
      color : {
        green : wb.createStyle({
          font : {
            color: '#006100' // do not use bootstrap colors but the ones from excel
          },
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#c6efce' // do not use bootstrap colors but the ones from excel
          }
        }),
        red : wb.createStyle({
          font : {
            color: '#9c0005' // do not use bootstrap colors but the ones from excel
          },
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#ffc7ce' // do not use bootstrap colors but the ones from excel
          }
        }),
        yellow : wb.createStyle({
          font : {
            color: '#9c6500' // do not use bootstrap colors but the ones from excel
          },
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#ffeb9c' // do not use bootstrap colors but the ones from excel
          }
        }),
        blue : wb.createStyle({
          font : {
            color: '#004085'
          },
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#cce5ff'
          }
        }),
        light : wb.createStyle({
          font : {
            color: '#818182'
          }
        }),
        invalid : wb.createStyle({
          font : {
            color: '#dc3545'
          }
        })
      },
      invalid_border_top_bottom : wb.createStyle({
        border: { 
          top: {
              style: 'medium',
              color: '#dc3545'
          },
          bottom: {
              style: 'medium',
              color: '#dc3545'
          }
        }
      }),
      invalid_border_left : wb.createStyle({
        border: { 
          left: {
              style: 'medium',
              color: '#dc3545'
          }
        }
      }),
      invalid_border_right : wb.createStyle({
        border: { 
          right: {
              style: 'medium',
              color: '#dc3545'
          }
        }
      })
    }
  }

}
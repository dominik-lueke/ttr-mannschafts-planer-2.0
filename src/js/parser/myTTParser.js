class MyTTParser {

  /**
   * return a json object that can be loaded as or into a PlanungsModel or {} if parsing fails
   * @param {*} url MyTischtennisUrl
   * @param {*} html The html belonging to the url
   */
  parseMyTTAufstellung(url, html) {
    // init return value
    var planung = {
      mannschaften: {
        liste: []
      },
      spieler: {
        liste: []
      },
      mytt: {
        aufstellung: {
          url: url,
          status: "ok"
        },
        qttr: {
          status: "ok",
          date: null
        }
      }
    }
    /* get information from url */
    planung = this.parseMyTTAufstellungsUrl(url, planung)
    /* get information from html */
    planung = this.parseMyTTAufstellungsHtml(html, planung)
    /* return */
    return planung
  }

  /**
   * Extract the saison, halbserie and verband from a vaild myTischtennis Aufstellungs URL
   * @param {*} url 
   * @param {*} planung 
   */
  parseMyTTAufstellungsUrl(url, planung){
    const url_split = url.split("/") 
    // Expect like "https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/187012/TuRa-Elsen/mannschaftsmeldungendetails/H/vr/"
    // url_split = [https:,,www.mytischtennis.de,clicktt,WTTV,19-20,verein,187012,TuRa-Elsen,mannschaftsmeldungendetails,H,vr,]
    var qttr_month
    var qttr_year
    if (url_split.length <= 13){
      // saison
      if ( (url_split[5]).match(/\d\d-\d\d/g) !== null ) {
        planung.saison = "20" + url_split[5].replace("-","/")
        qttr_year = parseInt(planung.saison.slice(0,4),10)
      }
      // serie
      const halbserie = url_split[11].replace("rr", "Rückrunde").replace("vr","Vorrunde")
      if (halbserie == "Vorrunde" || halbserie == "Rückrunde") {
        planung.halbserie = halbserie
        qttr_month = halbserie == "Vorrunde" ? 4 : 11 // 4 -> Mai; 11 -> Dez
      }
      // verband
      planung.verband = url_split[4]
      // qttr-date
      planung.mytt.qttr.date = new Date(qttr_year, qttr_month, 11)
      const qttr_age_in_days = ( Date.now() - planung.mytt.qttr.date ) / (1000*60*60*24)
      planung.mytt.qttr.status = qttr_age_in_days <= 90 ? "ok" : "outdated"
    }
    return planung
  }

  /**
   * Return the given planungs json filled with the found information in the html (mannschaften, spieler, etc)
   * @param {*} url 
   * @param {*} planung 
   */
  parseMyTTAufstellungsHtml(html, planung) {
    var jq = $('<div></div>');
    jq.html(`<html><head></head><body>${html}</body></html>`);
    // verein, spielklasse, verband, vereinsNummer
    const verein_spielklasse = jq.find(".panel-body > h3").first().text().split(", ") // "TuRa Elsen, Herren"
    const vereinsNummer = jq.find(".panel-body > h5").first().text().split(", ")[0].split(": ")[1] // "VNr.: 187012, Gründungsjahr: 1947"
    if (verein_spielklasse.length == 2 && vereinsNummer.match(/\d\d\d\d\d\d/g) !== null){
      planung.verein = verein_spielklasse[0]
      planung.vereinsNummer = vereinsNummer
      planung.spielklasse = verein_spielklasse[1]
    }
    // mannschaften, spieler
    const trs = jq.find("tbody tr")
    for (var j = 0; j < trs.length; j++) {
      var tr = $(trs[j])
      const spieler = {
        sbe: false,
        res: false,
        spv: {
          primary: false,
          secondary: 0
        }
      }
      const tds = tr.find("td")
      for (var i = 0; i < tds.length; i++) {
        var td = $(tds[i])
        switch (i) {
          case 0: //position
            var pos_text = td.text().trim().split(".")
            spieler.mannschaft = parseInt( pos_text[0], 10)
            spieler.position = parseInt( pos_text[1], 10)
            break;
          case 1: //qttr
            spieler.qttr = parseInt( td.text().trim(), 10)
            break;
          case 2: //name + mytt_id
            // <a role="button" tabindex="0" href="#" data-bind="playerPopover: { personId: 'NU1234567', clubNr: '123456' }" data-original-title="" title="">Nachname, Vorname</a>
            const a = td.find("a")
            spieler.name = a.text().trim()
            const data_bind_attr = JSON.parse( 
              ( typeof a.attr("data-bind") !== typeof undefined && a.attr("data-bind") !== false ) ? 
                a.attr("data-bind")
                .replace("playerPopover: ","")
                .replace("personId","\"personId\"")
                .replace("clubNr", "\"clubNr\"")
                .replace(/'/g,"\"") : "{}"
            )
            spieler.mytt_id = parseInt( ( "personId" in data_bind_attr ? data_bind_attr.personId : "").replace("NU",""), 10) 
            break;
          case 3: //hidden
            break;
          case 4: //status
            var status_text = td.text().trim().split(",")
            status_text.forEach(status => {
              spieler.sbe = spieler.sbe || status == "SBE"
              spieler.res = spieler.res || status == "RES"
              spieler.spv.primary = spieler.spv.primary || status == "SPV"
            })
            break;
          default:
            break;
        }
      }
      if ( "name" in spieler && spieler.name !== "" &&
           "mannschaft" in spieler && ! isNaN(spieler.mannschaft) && 
           "position" in spieler &&  ! isNaN(spieler.position)
      ) {
        planung.spieler.liste.push(spieler)
        if ( spieler.mannschaft > planung.mannschaften.liste.length ) {
          planung.mannschaften.liste.push( {
            nummer: spieler.mannschaft,
            spielklasse: planung.spielklasse
          } )
        }
      }
    }
    return planung
  }

  getResultOfMyTTAufstellungsParser(planung){
    var aufstellungFound = true
    var statusHtml = ""
    // verein + + vereinsNummer + verband
    if ("verein" in planung && "vereinsNummer" in planung && "verband" in planung) {
      statusHtml += `${planung.verein} (${planung.vereinsNummer} - ${planung.verband}) ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Kein Verein gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // saison
    if ("saison" in planung && "halbserie" in planung) {
      statusHtml += `${planung.halbserie} ${planung.saison} ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Saison gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // spielklasse
    if ("spielklasse" in planung){
      statusHtml += `${planung.spielklasse} ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Spielklasse gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    statusHtml += "<br/>"
    // mannschaften
    if (planung.mannschaften.liste.length > 0) {
      statusHtml += `${planung.mannschaften.liste.length} Mannschaften gefunden ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Mannschaften gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    // spieler
    if (planung.spieler.liste.length > 0) {
      statusHtml += `${planung.spieler.liste.length} Spieler gefunden ${this._getStatusIcon(true) } `
    } else {
      statusHtml += `Keine Spieler gefunden ${this._getStatusIcon(false) } `
      aufstellungFound = false
    }
    return { result: aufstellungFound, html: statusHtml }
  }

  _getStatusIcon(positive) {
    const icon = positive ? "check" : "times"
    const color = positive ? "success" : "danger"
    return `<i class="fa fa-${icon} text-${color}"></i>`
  }

}
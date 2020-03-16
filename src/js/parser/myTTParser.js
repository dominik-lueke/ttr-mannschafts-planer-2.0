class MyTTParser {

  /**
   * AUFSTELLUNG
   */

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
      aufstellung: {
        url: url,
        status: "ok"
      },
      ttrwerte: {
        status: "ok",
        date: null,
        aktuell: "Q-TTR",
        datestring: ""
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
      // verband
      if (url_split.length > 4) {
        planung.verband = url_split[4]
      }
      // saison
      if (url_split.length > 5) {
        if ( (url_split[5]).match(/\d\d-\d\d/g) !== null ) {
          planung.saison = "20" + url_split[5].replace("-","/")
          qttr_year = parseInt(planung.saison.slice(0,4),10)
        }
      }
      if (url_split.length > 11) {
        // serie
        const halbserie = url_split[11].replace("rr", "Rückrunde").replace("vr","Vorrunde")
        if (halbserie == "Vorrunde" || halbserie == "Rückrunde") {
          planung.halbserie = halbserie
          qttr_month = halbserie == "Vorrunde" ? 4 : 11 // 4 -> Mai; 11 -> Dez
        }
        // qttr-date
        planung.ttrwerte.date = new Date(qttr_year, qttr_month, 11)
        planung.ttrwerte.datestring = `${planung.ttrwerte.date.getDate()}.${planung.ttrwerte.date.getMonth()+1}.${planung.ttrwerte.date.getFullYear()}`
        const qttr_age_in_days = ( Date.now() - planung.ttrwerte.date ) / (1000*60*60*24)
        planung.ttrwerte.status = qttr_age_in_days <= 90 ? "ok" : "outdated"
      }

    }
    return planung
  }

  /**
   * Return the given planungs json filled with the found information in the mytischtennis aufstellungs html (mannschaften, spieler, etc)
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
      planung.vereinsNummer = parseInt(vereinsNummer, 10)
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
              spieler.reserve = spieler.reserve || status == "RES"
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

  /**
   * Analyze the planungs object and return 
   * {result: [true|false], html: <html-string to display}
   * the result is true if the planungs object is a loadable aufstellung
   * @param {*} planung 
   */
  getResultOfMyTTAufstellungsParser(planung){
    var aufstellungFound = true
    var statusHtml = ""
    // verein + + vereinsNummer + verband
    if ("verein" in planung && "vereinsNummer" in planung && "verband" in planung) {
      statusHtml += `${planung.verein} (${planung.vereinsNummer} - ${planung.verband}) ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Kein Verein gefunden ${this._getStatusIcon("danger") } `
      aufstellungFound = false
    }
    // saison
    if ("saison" in planung && "halbserie" in planung) {
      statusHtml += `${planung.halbserie} ${planung.saison} ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine Saison gefunden ${this._getStatusIcon("danger") } `
      aufstellungFound = false
    }
    // spielklasse
    if ("spielklasse" in planung){
      statusHtml += `${planung.spielklasse} ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine Spielklasse gefunden ${this._getStatusIcon("danger") } `
      aufstellungFound = false
    }
    statusHtml += "<br/>"
    // mannschaften
    if (planung.mannschaften.liste.length > 0) {
      statusHtml += `${planung.mannschaften.liste.length} Mannschaften gefunden ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine Mannschaften gefunden ${this._getStatusIcon("danger") } `
      aufstellungFound = false
    }
    // spieler
    if (planung.spieler.liste.length > 0) {
      statusHtml += `${planung.spieler.liste.length} Spieler gefunden ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine Spieler gefunden ${this._getStatusIcon("danger") } `
      aufstellungFound = false
    }
    return { result: aufstellungFound, html: statusHtml }
  }

  /**
   * TTR-RANGLISTE
   */

   /**
   * return a json object that can be loaded as or into a PlanungsModel or {} if parsing fails
   * @param {*} url MyTischtennisUrl
   * @param {*} html The html belonging to the url
   */
  parseMyTTTtrRangliste(url, html) {
    // init return value
    var planung = {
      spieler: {
        liste: []
      },
      ttrwerte: {
        url: url,
        status: "ok",
        date: null,
        aktuell: "Aktuell",
        datestring: ""
      }
    }
    /* get information from url */
    //planung = this.parseMyTTAufstellungsUrl(url, planung)
    /* get information from html */
    planung = this.parseMyTTTtrRanglisteHtml(html, planung)
    /* return */
    return planung
  }

  /**
   * Return the given planungs json filled with the found information in the mytischtennis ttr-rangliste html
   * @param {*} html 
   * @param {*} planung 
  */
  parseMyTTTtrRanglisteHtml(html, planung) {
    var jq = $('<div></div>');
    jq.html(`<html><head></head><body>${html}</body></html>`);
    // check if rangliste is still loading
    if (jq.find("div#rankingList").length > 0 ) {
      if ( jq.find("div#rankingList table.table-mytt").length == 0 ) {
        planung.ttrrangliste_still_loading = true
        return planung
      }
    } else if ( jq.find("form[action='/community/login/'][name='login']").length > 0 ) {
      // Login required
      planung.login_required = true
      return planung
    } else {
      // Not even a ttr-rangliste page
      return {}
    }
    // ttr or qttr
    var today = new Date(Date.now())
    var ttr_date = today
    const this_year = ttr_date.getFullYear()
    const header_ths = jq.find("div#rankingList table.table-mytt thead th") // header_ths = [Rang,D-Rang,Spieler,Verein,(Q-)TTR,<empty>]
    if ( $(header_ths[4]).text() == "Q-TTR" ) {
      [-11,1,4,7,11].forEach(month => {
        var year = this_year
        year -= month < 0 ? 1 : 0
        month = Math.abs(month)
        var qttr_stichtag = new Date(year, month, 11)
        if ( today.getTime() > qttr_stichtag.getTime()) { ttr_date = qttr_stichtag }
      })
      planung.ttrwerte.aktuell = "Q-TTR"
    }
    planung.ttrwerte.date = ttr_date
    planung.ttrwerte.datestring = `${planung.ttrwerte.date.getDate()}.${planung.ttrwerte.date.getMonth()+1}.${planung.ttrwerte.date.getFullYear()}`
    const qttr_age_in_days = ( Date.now() - planung.ttrwerte.date ) / (1000*60*60*24)
    planung.ttrwerte.status = qttr_age_in_days <= 90 ? "ok" : "outdated"
    // spieler
    var verein = null
    const trs = jq.find("div#rankingList table.table-mytt tbody tr")
    for (var j = 0; j < trs.length; j++) {
      var tr = $(trs[j])
      const spieler = {
        qttr: 0,
        name: "",
        mytt_id: 0
      }
      const tds = tr.find("td")
      for (var i = 0; i < tds.length; i++) {
        var td = $(tds[i])
        switch (i) {
          case 0: // rang
          case 1: // d-rang
            break;
          case 2: // name + verein
            // name: <a class="person123456 user-popover no-link" role="button" tabindex="0" data-tooltipdata="123456;0;Vorname Nachname;true"><span class="makered123456">Vorname <strong>Nachname</strong></span></a>
            const name_a = td.find("a").first()
            const nachname = name_a.find("strong").text().trim()
            var vorname = name_a.text().trim()
            vorname = vorname.slice(0, vorname.length - nachname.length - 1)
            spieler.name = `${nachname}, ${vorname}`
            const tooltipdata = name_a.attr("data-tooltipdata").split(";")
            spieler.mytt_id = parseInt(tooltipdata[0], 10)
            // verein: <a href="showclubinfo?isclickTTClub=1&amp;clubid=187012&amp;organisation=WTTV">TuRa Elsen</a>
            const verein_a = td.find("span a")
            const found_verein = verein_a.text().trim()
            // Only set verein here when all spieler have the same verein, else the planung will be invalid
            verein = (verein == null || found_verein == verein) ? found_verein : false
            break;
          case 3: // verein
            break
          case 4: // (q-)ttr
            spieler.qttr = parseInt(td.text().trim(), 10)
            break;
          default:
            break;
        }
      }
      if ( "name" in spieler && spieler.name !== "" &&
           "qttr" in spieler && ! isNaN(spieler.qttr) && 
           "mytt_id" in spieler && ! isNaN(spieler.mytt_id)
      ) {
        planung.spieler.liste.push(spieler)
      }
      // Only set verein here when all spieler have the same verein, else the planung will be invalid
      if (verein) { planung.verein = verein }
    }
    return planung
  }

  /**
   * Analyze the planungs object and return 
   * {result: [true|false], html: <html-string to display}
   * the result is true if the planungs object is a loadable aufstellung
   * @param {*} planung 
   */
  getResultOfMyTTTtrRanglisteParser(planung, target_verein){
    var ttrranglisteFound = true
    var statusHtml = ""
    if ( "login_required" in planung ){
      return { result: false, html: `Bitte einloggen ${this._getStatusIcon("warning")}` }
    }
    if ("ttrrangliste_still_loading" in planung) {
      return { result: false, html: `Suche TTR-Werte <div class="spinner-grow spinner-grow-sm" role="status"></div>` }
    }
    if ( $.isEmptyObject(planung) ) {
      return { result: false, html: `Keine TTR-Rangliste gefunden ${this._getStatusIcon("danger") }` }
    }
    // verein + + vereinsNummer + verband
    if ("verein" in planung && planung.verein == target_verein ) {// && "vereinsNummer" in planung && "verband" in planung) {
      statusHtml += `${planung.verein} ${this._getStatusIcon("success") } ` // (${planung.vereinsNummer} - ${planung.verband})
    } else {
      statusHtml += `${planung.verein} (Nicht ${target_verein}) ${this._getStatusIcon("danger") } `
      ttrranglisteFound = false
    }
    // aktuelle oder qttr werte
    if ("ttrwerte" in planung && "aktuell" in planung.ttrwerte && "datestring" in planung.ttrwerte) {
      statusHtml += `Stichtag: ${planung.ttrwerte.datestring} (${planung.ttrwerte.aktuell}) ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine TTR-Werte gefunden ${this._getStatusIcon("danger") } `
    }
    statusHtml += "<br/>"
    // spieler
    if (planung.spieler.liste.length > 0) {
      statusHtml += `${planung.spieler.liste.length} Spieler gefunden ${this._getStatusIcon("success") } `
    } else {
      statusHtml += `Keine Spieler gefunden ${this._getStatusIcon("danger") } `
      ttrranglisteFound = false
    }
    return { result: ttrranglisteFound, html: statusHtml }
  }

  /**
   * PRIVATE
   */

  _getStatusIcon(status) {
    const icon = status == "success" ? "check" : status == "danger" ? "times" : status == "warning" ? "warning" : ""
    return `<i class="fa fa-${icon} text-${status}"></i>`
  }

}
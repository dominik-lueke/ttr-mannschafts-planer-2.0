class HeaderView {
  constructor() {
    // The header element
    $('#header').append(`
      <div class="d-flex bg-dark text-white text-center fixed-top">
        <div class="p-2 flex-fill">
          <h4><small id="planung-verein" data-toggle="tooltip" data-placement="bottom" data-html="true" title=""></small></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4 id="planung-serie-spielklasse"></h4>
        </div>
        <div class="p-2 flex-fill">
          <div id="header-mytt-status-div">
            <div class="d-flex justify-content-center pt-1">
              <div id="header-aufstellung-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" class="mr-2">
                <span class="badge badge-dark p-1 text-muted link" data-toggle="modal" data-target="#planung-reload-data-modal" >CLICK-TT</span>
                <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
              </div>
              <div id="header-ttrwerte-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" class="mr-2">
                <span class="badge badge-dark p-1 text-muted link" data-toggle="modal" data-target="#planung-reload-data-modal">TTR</span>
                <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
              </div>
              <div id="header-bilanzen-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="">
                <span class="badge badge-dark p-1 text-muted link" data-toggle="modal" data-target="#planung-reload-data-modal">11:9</span>
                <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
              </div>
            </div>
          </div>
          <div id="header-print-date-div" class="display-none">
            <h4><small id="header-print-date">${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}</small></h4>
          </div>
        </div>
      </div>
    `)
    this.planung = {}
    this.mytt_aufstellung_url = ""
    this.mytt_status = {
      div: $("#header-mytt-status-div"),
      aufstellung: {
        div: $("#header-aufstellung-status-icon"),
        badge: $("#header-aufstellung-status-icon .badge"),
        icon: $("#header-aufstellung-status-icon i.fa"),
      },
      ttrwerte: {
        div: $("#header-ttrwerte-status-icon"),
        badge: $("#header-ttrwerte-status-icon .badge"),
        icon: $("#header-ttrwerte-status-icon i.fa"),
      },
      bilanzen: {
        div: $("#header-bilanzen-status-icon"),
        badge: $("#header-bilanzen-status-icon .badge"),
        icon: $("#header-bilanzen-status-icon i.fa"),
      }
    }
    this.print_date = $('#header-print-date')
  }

  bindClickOnReloadDataButon(handler) {
    this.mytt_status.aufstellung.badge.click( (event) => {
      handler("aufstellung")
    })
    this.mytt_status.ttrwerte.badge.click( (event) => {
      handler("ttrwerte")
    })
    this.mytt_status.bilanzen.badge.click( (event) => {
      handler("bilanzen")
    })
  }

  updateHeader(planung) {
    this.planung = planung
    this.mytt_aufstellung_url = planung.aufstellung.url
    $('#planung-verein').text(planung.verein);
    $('#planung-verein').attr("title", `Verband: ${planung.verband}<br/>Vereins-Nr.: ${planung.vereinsNummer}`);
    $('#planung-verein').tooltip('dispose').tooltip()
    $('#planung-serie-spielklasse').text(planung.halbserie + " " + planung.saison + " - " + planung.spielklasse);
    this._updateMyTTStatusIcons()
    if(this.planung.isNew) {
      $('#planung-serie-spielklasse').text("Tischtennis Mannschafts Planer").addClass("display-4")
      this.mytt_status.div.addClass("display-none")
    } else {
      $('#planung-serie-spielklasse').removeClass("display-4")
      this.mytt_status.div.removeClass("display-none")
    }
    this.print_date.text(`${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}`)
  }

  _updateMyTTStatusIcons() {
    if ( this.planung.isEmpty ){
      this.mytt_status.div.addClass("display-none")
    } else {
      this.mytt_status.div.removeClass("display-none")
    }
    
    switch (this.planung.aufstellung.status) {
      case "offline":
        this.mytt_status.aufstellung.badge.addClass("text-muted")
        this.mytt_status.aufstellung.icon.addClass("fa-times-circle").removeClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.aufstellung.icon.addClass("text-muted").removeClass("text-success").removeClass("text-warning")
        this.mytt_status.aufstellung.div.attr("title", "Es wurde keine Aufstellung von myTischtennis geladen")
        break
      case "ok":
        this.mytt_status.aufstellung.badge.removeClass("text-muted")
        this.mytt_status.aufstellung.icon.removeClass("fa-times-circle").addClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.aufstellung.icon.removeClass("text-muted").addClass("text-success").removeClass("text-warning")
        this.mytt_status.aufstellung.div.attr("title", "Die Aufstellung der letzten Halbserie wurde von myTischtennis geladen")
        break
      case "outdated":
        this.mytt_status.aufstellung.badge.removeClass("text-muted")
        this.mytt_status.aufstellung.icon.removeClass("fa-times-circle").removeClass("fa-check-circle").addClass("fa-warning")
        this.mytt_status.aufstellung.icon.removeClass("text-muted").removeClass("text-success").addClass("text-warning")
        this.mytt_status.aufstellung.div.attr("title", "Die von myTischtennis geladene Aufstellung liegt über eine Halbserie zurück")
        break
      default:
        break
    }

    switch (this.planung.ttrwerte.status) {
      case "offline":
        this.mytt_status.ttrwerte.badge.addClass("text-muted")
        this.mytt_status.ttrwerte.icon.addClass("fa-times-circle").removeClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.ttrwerte.icon.addClass("text-muted").removeClass("text-success").removeClass("text-warning")
        this.mytt_status.ttrwerte.div.attr("title", "Es wurden noch keine TTR-Werte von myTischtennis geladen")
        break
      case "ok":
        this.mytt_status.ttrwerte.badge.removeClass("text-muted")
        this.mytt_status.ttrwerte.icon.removeClass("fa-times-circle").addClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.ttrwerte.icon.removeClass("text-muted").addClass("text-success").removeClass("text-warning")
        this.mytt_status.ttrwerte.div.attr("title", `Die geladenen TTR-Werte sind vom ${this.planung.ttrwerte.datestring}`)
        break
      case "outdated":
        this.mytt_status.ttrwerte.badge.removeClass("text-muted")
        this.mytt_status.ttrwerte.icon.removeClass("fa-times-circle").removeClass("fa-check-circle").addClass("fa-warning")
        this.mytt_status.ttrwerte.icon.removeClass("text-muted").removeClass("text-success").addClass("text-warning")
        this.mytt_status.ttrwerte.div.attr("title", `Seit dem Datum der geladenen TTR-Werte (${this.planung.ttrwerte.datestring}) gab es bereits einen neuen Q-TTR Stichtag. Die neuen Werte werden kurz darauf veröffentlicht.`)
        break
      default:
        break
    }

    switch (this.planung.bilanzen.status) {
      case "offline":
        this.mytt_status.bilanzen.badge.addClass("text-muted")
        this.mytt_status.bilanzen.icon.addClass("fa-times-circle").removeClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.bilanzen.icon.addClass("text-muted").removeClass("text-success").removeClass("text-warning")
        this.mytt_status.bilanzen.div.attr("title", "Es wurden noch keine Bilanzen von myTischtennis geladen")
        break
      case "ok":
        this.mytt_status.bilanzen.badge.removeClass("text-muted")
        this.mytt_status.bilanzen.icon.removeClass("fa-times-circle").addClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.bilanzen.icon.removeClass("text-muted").addClass("text-success").removeClass("text-warning")
        var title_attr = `Die geladenen Bilanzen sind aktuell.`
        this.planung.bilanzen.saisons.forEach(saison => {
          title_attr += `<br/>${saison} <i class="fa fa-check"></i>`
        })
        this.mytt_status.bilanzen.div.attr("title", title_attr)
        break
      case "outdated":
        this.mytt_status.bilanzen.badge.removeClass("text-muted")
        this.mytt_status.bilanzen.icon.removeClass("fa-times-circle").removeClass("fa-check-circle").addClass("fa-warning")
        this.mytt_status.bilanzen.icon.removeClass("text-muted").removeClass("text-success").addClass("text-warning")
        var title_attr = `Die geladenen Bilanzen sind nicht aktuell.`
        this.planung.bilanzen.saisons.forEach(saison => {
          title_attr += `<br/>${saison} <i class="fa fa-check"></i>`
        })
        this.mytt_status.bilanzen.div.attr("title", title_attr)
        break
      default:
        break
    }

    // activate tooltips
    ["aufstellung", "ttrwerte", "bilanzen"].forEach( key => {
      this.mytt_status[key].div.tooltip('dispose')
      this.mytt_status[key].div.tooltip()
    })
    
  }
}
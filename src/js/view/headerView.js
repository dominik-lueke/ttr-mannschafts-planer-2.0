class HeaderView {
  constructor() {
    // The header element
    $('#header').append(`
      <div class="d-flex bg-dark text-white text-center fixed-top">
        <div class="p-2 flex-fill">
          <h4><small id="planung-verein" data-toggle="tooltip" data-placement="bottom" data-html="true" title=""></small></h4>
          <h6><small id="planung-verband"></small></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4 id="planung-serie"></h4>
          <h6 id="planung-spielklasse"></h6>
        </div>
        <div class="p-2 flex-fill">
          <h4 id="planung-reload-data-button" class="link" data-toggle="modal" data-target="#planung-reload-data-modal">
            <i class="fa fa-cloud-download" data-toggle="tooltip" data-placement="bottom" data-html="true" title="Aktualisiere Daten<br/>von myTischtennis.de"></i>
          </h4>
          <div class="d-flex justify-content-center">
            <div id="header-aufstellung-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" class="mr-2">
              <span class="badge badge-dark p-1 text-muted">CLICK-TT</span>
              <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
            </div>
            <div id="header-ttrwerte-status-icon" data-toggle="tooltip" data-placement="bottom" data-html="true" title="">
              <span class="badge badge-dark p-1 text-muted">TTR</span>
              <sub><i class="fa fa-times-circle text-muted overlay-icon"></i></sub>
            </div>
            <!--
            <span class="badge badge-dark p-1">11:9</span><sub><i class="fa fa-times-circle text-danger overlay-icon"></i></sub>
            -->
          </div>
        </div>
      </div>
    `)
    this.planung = {}
    this.mytt_aufstellung_url = ""
    this.reload_data_button = $("#planung-reload-data-button")
    this.mytt_status = {
      aufstellung: {
        div: $("#header-aufstellung-status-icon"),
        badge: $("#header-aufstellung-status-icon .badge"),
        icon: $("#header-aufstellung-status-icon i.fa"),
      },
      ttrwerte: {
        div: $("#header-ttrwerte-status-icon"),
        badge: $("#header-ttrwerte-status-icon .badge"),
        icon: $("#header-ttrwerte-status-icon i.fa"),
      }
    }
  }

  bindClickOnReloadDataButon(handler) {
    this.reload_data_button.click( (event) => {
      handler(this.planung.mytt.aufstellung.url)
    })
  }

  updateHeader(planung) {
    this.planung = planung
    this.mytt_aufstellung_url = planung.mytt.aufstellung.url
    $('#planung-verein').text(planung.verein);
    $('#planung-verein').attr("title", `Vereins-Nr.: ${planung.vereinsNummer}`);
    $('#planung-verein').tooltip('dispose')
    $('#planung-verein').tooltip()
    $('#planung-verband').text(planung.verband);
    $('#planung-serie').text(planung.halbserie + " " + planung.saison);
    $('#planung-spielklasse').text(planung.spielklasse);
    this._updateMyTTStatusIcons()
  }

  _updateMyTTStatusIcons() {
    switch (this.planung.mytt.aufstellung.status) {
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
    const ttrwerte_date_string = `${this.planung.mytt.ttrwerte.date.getDate()}.${this.planung.mytt.ttrwerte.date.getMonth()+1}.${this.planung.mytt.ttrwerte.date.getFullYear()}`
    switch (this.planung.mytt.ttrwerte.status) {
      case "offline":
        this.mytt_status.ttrwerte.badge.addClass("text-muted")
        this.mytt_status.ttrwerte.icon.addClass("fa-times-circle").removeClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.ttrwerte.icon.addClass("text-muted").removeClass("text-success").removeClass("text-warning")
        this.mytt_status.ttrwerte.div.attr("title", "Es wurden keine TTR-Werte von myTischtennis geladen")
        break
      case "ok":
        this.mytt_status.ttrwerte.badge.removeClass("text-muted")
        this.mytt_status.ttrwerte.icon.removeClass("fa-times-circle").addClass("fa-check-circle").removeClass("fa-warning")
        this.mytt_status.ttrwerte.icon.removeClass("text-muted").addClass("text-success").removeClass("text-warning")
        
        this.mytt_status.ttrwerte.div.attr("title", `Die geladenen TTR-Werte sind vom ${ttrwerte_date_string}`)
        break
      case "outdated":
        this.mytt_status.ttrwerte.badge.removeClass("text-muted")
        this.mytt_status.ttrwerte.icon.removeClass("fa-times-circle").removeClass("fa-check-circle").addClass("fa-warning")
        this.mytt_status.ttrwerte.icon.removeClass("text-muted").removeClass("text-success").addClass("text-warning")
        this.mytt_status.ttrwerte.div.attr("title", `Das Datum der geladenen TTR-Werte (${ttrwerte_date_string}) liegt über 90 Tage zurück`)
        break
      default:
        break
    }
    // activate tooltips
    ["aufstellung", "ttrwerte"].forEach( key => {
      this.mytt_status[key].div.tooltip('dispose')
      this.mytt_status[key].div.tooltip()
    })
    
  }
}
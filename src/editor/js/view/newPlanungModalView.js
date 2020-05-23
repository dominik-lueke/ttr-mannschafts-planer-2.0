class NewPlanungModalView {

  constructor() {
    $("#newPlanungModal").append(this._getHtml())
    // fill form
    this.fillVerbandSelectFromGlobalConstants()
    this.fillSpielklasseSelectFromGlobalConstants()
    this.fillHalbserieSaisonFromCurrentDate()
    // bind handlers
    $('#newPlanungsFormVerband').on('change', () => { this.verbandChanged() })
    $('#newPlanungsFormVerein').on('change', () => { this.setVereinsseiteHref() } )
    $('#newPlanungsFormVereinsnummer').on('change', () => { this.setVereinsseiteHref() } )
    $('#newPlanungsFormSaison').on('change', () => { this.setVereinsseiteHref() } )
  }

  fillVerbandSelectFromGlobalConstants() {
    const verbandSelect = $('#newPlanungsFormVerband')
    Object.keys(VERBÄNDE).forEach(verband => {
      verbandSelect.append(`<option value="${verband}">${VERBÄNDE[verband]} (${verband})</option>`)
    })
    verbandSelect.find(`option[value="${DEFAULT_VERBAND}"]`).attr('selected',"true")
  }

  fillSpielklasseSelectFromGlobalConstants() {
    const spielklasseSelect = $('#newPlanungsFormSpielklasse')
    Object.keys(SPIELKLASSEN).forEach(spielklasse => {
      spielklasseSelect.append($(`<option value="${spielklasse}">${spielklasse}</option>`))
    })
  }

  fillHalbserieSaisonFromCurrentDate() {
    const today = new Date(Date.now())
    const month = today.getMonth() + 1
    const halbserie = month in [9,10,11,12] ? "Rückrunde" : "Vorrunde"
    $('#newPlanungsFormHalbserie').val(halbserie)
    const year = today.getFullYear()
    $('#newPlanungsFormSaison').val(`${year}/${year - 1999}`)
  }

  verbandChanged () {
    if ($('#newPlanungsFormVerband').val() !== DEFAULT_VERBAND) {
      $('#verbandHelp').show()
    } else {
      $('#verbandHelp').hide()
    }
    this.setVereinssucheHref()
  }

  setVereinssucheHref() {
    $('#vereinHelp a').attr('href', `https://www.mytischtennis.de/clicktt/${ $('#newPlanungsFormVerband').val() }/vereinssuche/`)
  }

  setVereinsseiteHref() {
    const verband = $('#newPlanungsFormVerband').val()
    const verein = GET_URL_SLUG_OF_VEREIN($('#newPlanungsFormVerein').val())
    const vereinsnummer = $('#newPlanungsFormVereinsnummer').val()
    const saison = $('#newPlanungsFormSaison').val().replace("/","-").substring(2)
    if (verein !== "" && vereinsnummer.match('[0-9]{3}[0-9]*') && saison.match('[0-9]{2}-[0-9]{2}')) {
      $('#vereinCheck').removeClass('display-none')
      $('#vereinCheck a').attr('href', `https://www.mytischtennis.de/clicktt/${verband}/${saison}/verein/${vereinsnummer}/${verein}/info/`)
    } else {
      $('#vereinCheck').addClass('display-none')
      $('#vereinCheck a').attr('href', `#`)
    }
  }

  bindClickSubmitPlanungButton(handler) {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          event.preventDefault()
          this.hidePlanungModal()
          // form is valid
          var planung_json = {
            verein:         $('#newPlanungsFormVerein').val(),
            verband:        $('#newPlanungsFormVerband').val(),
            vereinsNummer:  $('#newPlanungsFormVereinsnummer').val(),
            saison:         $('#newPlanungsFormSaison').val(),
            halbserie:      $('#newPlanungsFormHalbserie').val(),
            spielklasse:    $('#newPlanungsFormSpielklasse').val(),
            isNew:          false,
          }
          handler( planung_json )
        }
        form.classList.add('was-validated');
      }.bind(this), false);
    }.bind(this));
  }

  displayPlanungModal() {
    $('#new-planung-modal').modal('show')
  }

  hidePlanungModal() {
    $('#new-planung-modal').modal('hide')
  }

  destroyPlanungModal() {
    this.hidePlanungModal()
    $("#newPlanungModal").empty()
  }

  /* PRIVATE */
  _getHtml() {
    return `
    <div class="modal fade" id="new-planung-modal" tabindex="-1" role="dialog" aria-labelledby="new-planung-modal-label" aria-hidden="true" data-backdrop="static" >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="new-planung-modal-label">Neue Saison Planung</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>
              <!--<h6 class="text-center">Daten manuell eingeben:</h6>-->
              <div class="form-row">
                  <div class="col-sm-12 mb-3">
                  <label for="newPlanungsFormVerband">Verband</label>
                  <select type="text" class="form-control" id="newPlanungsFormVerband" required>
                  </select>
                  <small id="verbandHelp" class="form-text text-muted display-none"><i class="fa fa-warning text-warning"></i> Diesem Tool liegt die ${DEFAULT_VERBAND} Wettspielordnung (<a href="file://assets/WO2020-01-01.pdf" class="text-success">Stand 01/2020</a>) zugrunde.<br/> Auch die <a href="https://mytischtennis.de" class="text-success">myTischtennis.de</a> Integration zum Laden von Aufstellungen, TTR-Werten und Bilanzen ist für die ${DEFAULT_VERBAND} Spielklassen optimiert.</small>
                  <div class="invalid-feedback">
                    Bitte einen Verband eingeben
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormVerein">Verein 
                    <small>
                      <i class="fa fa-info-circle" data-toggle="tooltip" data-html="true" data-placement="top" 
                          title="Bitte den Verein so eingeben, wie er bei click-TT benannt ist. Nur so funktioniert später das Laden einer Aufstellung von myTischtennis.de. Nutze die Vereinssuche, wenn Du dir unsicher bist."></i>
                    </small>
                  </label>
                  <input type="text" class="form-control" id="newPlanungsFormVerein" placeholder="Verein" required>
                  <small id="vereinHelp" class="form-text text-muted">Zur <a tabindex="-1" class="text-success" href="https://www.mytischtennis.de/clicktt/${DEFAULT_VERBAND}/vereinssuche/">Vereinssuche</a> auf myTischtennis.de</small>
                  <div class="invalid-feedback">
                    Bitte einen Vereinsnamen eingeben
                  </div>
                </div>
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormVereinsnummer">Vereins-Nummer 
                    <small>
                      <i class="fa fa-info-circle" data-toggle="tooltip" data-html="true" data-placement="top" 
                          title="Die Vereins-Nummer findest du auf der Info-Seite deines Vereins auf myTischtennis.de oder die Vereinssuche">
                      </i>
                    </small>
                  </label>
                  <input type="text" class="form-control" id="newPlanungsFormVereinsnummer" placeholder="123456" pattern="[0-9]{3}[0-9]*" required>
                  <small id="vereinCheck" class="form-text text-muted display-none">Zur <a class="text-success" href="#">Vereinsseite</a> auf myTischtennis.de</small>
                  <div class="invalid-feedback">
                    Bitte eine gültige Vereins-Nummer eingeben
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormHalbserie">Halbserie</label>
                  <select id="newPlanungsFormHalbserie" class="form-control" required>
                    <option value="Vorrunde">Vorrunde</option>
                    <option value="Rückrunde">Rückrunde</option>
                  </select>
                  <div class="invalid-feedback">
                    Bitte eine Halbserie eingeben
                  </div>
                </div>
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormSaison">Saison</label>
                  <input type="text" class="form-control" id="newPlanungsFormSaison" placeholder="" pattern="20[0-9]{2}/[0-9]{2}" value="" required>
                  <div class="invalid-feedback">
                    Bitte eine gültige Saison eingeben
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 mb-3">
                  <label for="newPlanungsFormSpielklasse">Spielklasse</label>
                  <select id="newPlanungsFormSpielklasse" class="form-control" required>
                  </select>
                  <div class="invalid-feedback">
                    Bitte eine Spielklasse eingeben
                  </div>
                </div>
              </div>
              <hr />
              <button class="btn btn-success pull-right mt-3" type="submit">Planung starten</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
  }

}
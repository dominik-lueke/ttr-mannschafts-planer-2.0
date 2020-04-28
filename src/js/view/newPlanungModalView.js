class NewPlanungModalView {

  constructor() {
    $("#newPlanungModal").append(this._getHtml())
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
            vereinsNummer:  parseInt($('#newPlanungsFormVereinsnummer').val(),10),
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
          </div>
          <div class="modal-body">
            <form class="needs-validation" novalidate>
              <!--<h6 class="text-center">Daten manuell eingeben:</h6>-->
              <div class="form-row">
                  <div class="col-sm-12 mb-3">
                  <label for="newPlanungsFormVerband">Verband</label>
                  <select type="text" class="form-control" id="newPlanungsFormVerband" required>
                    <option value="BaTTV">Baden (BaTTV)</option>
                    <option value="ByTTV">Bayern (ByTTV)</option>
                    <option value="TTVB">Brandenburg (TTVB)</option>
                    <option value="FTTB">Bremen (FTTB)</option>
                    <option value="HaTTV">Hamburg (HaTTV)</option>
                    <option value="HeTTV">Hessen (HeTTV)</option>
                    <option value="TTVMV">Mecklenburg-Vorpommern (TTVMV)</option>
                    <option value="TTVN">Niedersachsen (TTVN)</option>
                    <option value="PTTV">Pfalz (PTTV)</option>
                    <option value="RTTV">Rheinhessen (RTTV)</option>
                    <option value="TTVR">Rheinland (TTVR)</option>
                    <option value="STTB">Saarland (STTB)</option>
                    <option value="TTVSA">Sachsen-Anhalt (TTVSA)</option>
                    <option value="SbTTV">Südbaden (SbTTV)</option>
                    <option value="TTTV">Thüringen (TTTV)</option>
                    <option value="WTTV" selected>NRW (WTTV)</option>
                    <option value="TTVWH">Würtemberg-Hohenzollern (TTVWH)</option>
                  </select>
                  <div class="invalid-feedback">
                    Bitte einen Verband eingeben
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormVerein">Verein <small><i class="fa fa-info-circle" data-toggle="tooltip" data-html="true" data-placement="top" title="Bitte den Verein so eingeben, wie er bei click-TT benannt ist. Nur so funktioniert später das Laden einer Aufstellung von myTischtennis"></i></small></label>
                  <input type="text" class="form-control" id="newPlanungsFormVerein" placeholder="Verein" value="Verein"  required>
                  <div class="invalid-feedback">
                    Bitte einen Vereinsnamen eingeben
                  </div>
                </div>
                <div class="col-sm-6 mb-3">
                  <label for="newPlanungsFormVereinsnummer">Vereins-Nummer</label>
                  <input type="text" class="form-control" id="newPlanungsFormVereinsnummer" placeholder="123456" pattern="[0-9]{3}[0-9]*" value="123456" required>
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
                  <input type="text" class="form-control" id="newPlanungsFormSaison" placeholder="2020/21" pattern="20[0-9]{2}/[0-9]{2}" value="2020/21" required>
                  <div class="invalid-feedback">
                    Bitte eine gültige Saison eingeben
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="col-sm-12 mb-3">
                  <label for="newPlanungsFormSpielklasse">Spielklasse</label>
                  <select id="newPlanungsFormSpielklasse" class="form-control" required>
                    <optgroup label="Erwachsene">
                      <option value="Herren">Herren</option>
                      <option value="Damen">Damen</option>
                    </optgroup>
                    <optgroup label="Mädchen">
                      <option value="Mädchen 18">Mädchen 18</option>
                      <option value="Mädchen 15">Mädchen 15</option>
                      <option value="Mädchen 13">Mädchen 13</option>
                      <option value="Mädchen 11">Mädchen 11</option>
                    </optgroup>
                    <optgroup label="Jungen">
                      <option value="Jungen 18">Jungen 18</option>
                      <option value="Jungen 15">Jungen 15</option>
                      <option value="Jungen 13">Jungen 13</option>
                      <option value="Jungen 11">Jungen 11</option>
                    </optgroup>
                    <optgroup label="Seniorinnen">
                      <option value="Seniorinnen 40">Seniorinnen 40</option>
                      <option value="Seniorinnen 50">Seniorinnen 50</option>
                      <option value="Seniorinnen 60">Seniorinnen 60</option>
                      <option value="Seniorinnen 70">Seniorinnen 70</option>
                    </optgroup>
                    <optgroup label="Senioren">
                      <option value="Senioren 40">Senioren 40</option>
                      <option value="Senioren 50">Senioren 50</option>
                      <option value="Senioren 60">Senioren 60</option>
                      <option value="Senioren 70">Senioren 70</option>
                    </optgroup>
                  </select>
                  <div class="invalid-feedback">
                    Bitte eine Spielklasse eingeben
                  </div>
                </div>
              </div>
              <!--
              <hr />
              <h6 class="text-center">Oder aus myTischtennis URL laden</h6>
              <div class="form-row">
                <div class="col-sm-12 mb-3">
                  <input type="text" class="form-control" id="newPlanungsFormURL" aria-describedby="newPlanungsFormURLPrepend"
                    title="https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/123456/Vereinsname/mannschaftsmeldungendetails/H/vr/" 
                    placeholder="https://www.mytischtennis.de/clicktt/WTTV/19-20/verein/123456/Vereinsname/mannschaftsmeldungendetails/H/vr/" >
                  <div class="invalid-feedback">
                  </div>
                </div>
              </div>
              -->
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
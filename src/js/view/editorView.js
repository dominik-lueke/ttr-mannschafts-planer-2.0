class EditorView {
  constructor() {
    $('#editor').append(`
      <div class="container editor-container">
        <div class="row">
          <div class="col-8">
            <div id="mannschafts-container" class="container">
            </div>
            <div class="container">
              <div class="row mannschafts-row">
                <div class="card mannschaft">
                  <button class="btn btn-light text-muted">
                    <i class="fa fa-plus"></i>
                    Mannschaft hinzufügen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `)
    this.mannschaftsContainer = $('#mannschafts-container')
    this.mannschaftViews = []
  }

  displayMannschaften(mannschaften, spieler) {
    // Delete all nodes execpt the "Mannschaft hinzufügen" button
    this.mannschaftViews.forEach( mannschaft => { mannschaft.delete() })
    this.mannschaftViews = []

    // Create Mannschafts rows for each Mannschaft in state
    mannschaften.forEach(mannschaft => {
      const mannschaftsspieler = spieler.filter(spieler => spieler.mannschaft === mannschaft.nummer).sort((a,b) => { return a.position - b.position })
      this.mannschaftViews.push( new MannschaftView(this.mannschaftsContainer, mannschaft, mannschaftsspieler) )
    })

    // Activate sorting
    $( ".connectedSortable" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
    
  }

  bindAddSpieler(handler) {
    this.mannschaftViews.forEach(mannschaft => { mannschaft.bindAddSpieler(handler)})
  }

}


/*

<div class="container mannschafts-container">
          <div class="row">
            <div class="col-8">
              <div class="container">
                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <div class="card-header mannschaft-header">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5><a onclick="showHerrenIDetails()" href="#" class="text-dark">Herren I</a></h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Verbandsliga</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Samstag, 17:30 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>A</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 1
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1900
                          </div>
                          <div class="p-2 ttr-difference text-success">
        
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 2
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1840
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -60
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 3
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1820
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -20
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler invalid spieler-invalid">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 4
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1860
                          </div>
                          <div class="p-2 ttr-difference text-danger" data-toggle="tooltip" data-placement="right"
                        data-html="true" title="<b>Ungültige Reihenfolge</b><br/>Spieler 4 hat 40 TTR-Punkte mehr als Spieler 3">
                            +40
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 5
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1820
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -40
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            1.6
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 6
                            <span class="spieler-extra-icon text-warning">
                              <i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="right" title="Spieler 6 hatte in der letzten Halbserie weniger als 6 Einsätze"></i>
                            </span>
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1810
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row mannschafts-row">
                  <div class="card mannschaft invalid mannschaft-invalid">
                    <div class="card-header mannschaft-header" data-toggle="tooltip" data-placement="left" data-html="true"
                      title="<b>Fehlende Sollstärke</b><br/>Herren II hat nur 5 Stammspieler">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5>Herren II</h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Landesliga</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Samstag, 17:30 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>B</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 7
                          </div>
                          <div class="p-2 spv">
                            <span class="badge badge-danger spv-badge">SPV</span>
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1910
                          </div>
                          <div class="p-2 ttr-difference text-danger">
                            +100
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 8
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1750
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            <a onclick="showSpieler9Details()">Spieler 9 <i class="fa fa-comment-o text-muted spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Kommentar"></i></a>
                            
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1740
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 10
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1730
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 11
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1720
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            2.6
                          </div>
                          <div class="p-2 text-muted flex-grow-1">
                            Spieler 12
                            <span class="badge badge-secondary spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Spieler 12 hatte in der letzten Halbserie keinen Einsatz">RES</span>
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1710
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <div class="card-header mannschaft-header">
                      <div class="d-flex justify-content-between">
                        <div class="p-2">
                          <h5>Herren III</h5>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Bezirksklasse</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>Freitag, 20:00 Uhr</small>
                        </div>
                        <div class="p-2 text-muted">
                          <small>A</small>
                        </div>
                      </div>
                    </div>
                    <ul class="list-group list-group-flush connectedSortable">
                      <li class="list-group-item spieler invalid spieler-invalid" data-toggle="tooltip" data-placement="left"
                        data-html="true" title="<b>Ungültige Reihenfolge</b><br/>Spieler 13 hat 70 TTR-Punkte mehr als Spieler 12">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.1
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 13
                          </div>
                          <div class="p-2 spv">
                            <span class="badge badge-light spv-badge">SPV</span>
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1780
                          </div>
                          <div class="p-2 ttr-difference text-danger">
                            +70
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.2
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 14
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1650
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -130
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.3
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 15
                            <span class="badge badge-dark spieler-extra-icon" data-toggle="tooltip" data-placement="right"
                              data-html="true" title="Jugend Ersatzspieler">JES</span>
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1640
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler spieler-farbe-warning">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.4
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 16
                          </div>
                          <div class="p-2 spv">
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1630
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.5
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 17
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1620
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                      <li class="list-group-item spieler">
                        <div class="d-flex">
                          <div class="p-2 text-muted">
                            3.6
                          </div>
                          <div class="p-2 flex-grow-1">
                            Spieler 18
                          </div>
                          <div class="p-2 spv">
        
                          </div>
                          <div class="p-2 ttr-wert text-muted">
                            1610
                          </div>
                          <div class="p-2 ttr-difference text-success">
                            -10
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div class="card-footer bg-transparent mannschaft-footer">
                      <button class="btn btn-light text-muted">
                        <i class="fa fa-plus"></i>
                        Spieler hinzufügen
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row mannschafts-row">
                  <div class="card mannschaft">
                    <button class="btn btn-light text-muted">
                      <i class="fa fa-plus"></i>
                      Mannschaft hinzufügen
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

*/
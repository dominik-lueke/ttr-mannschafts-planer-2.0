class Model {

  constructor() {
    this.planung = new PlanungsModel("TuRa Elsen", 187012, "2019/20", "Rückrunde", "11.12.2019", "Herren")

    /* Fill with sample Data */
    const qttr_max = 1910
    for (var i=1; i<=3; i++) {
      this.planung.addMannschaft(i, "Liga", 6, "Samstag", "18:30", "A")
      for (var j=1; j<=6; j++) {
        var id = ( i - 1 ) * 6 + j
        this.planung.addSpieler(i, j, `Nachname, Vorname${id} sehr lange Namen hier`, qttr_max - 15 * i * j)
      }
    }

  }

}
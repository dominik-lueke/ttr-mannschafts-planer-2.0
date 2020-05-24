/* DEFINE GLOBAL CONSTANTS HERE */

const SPIELKLASSEN = {
  Erwachsene:{
    "Herren":{
      name: "Herren",
      url_slug: "H"
    },
    "Damen":{
      name: "Damen",
      url_slug: "D"
    }
  },
  Mädchen: {
    "Mädchen 18":{
      name: "Mädchen 18",
      url_slug: "M18"
    },
    "Mädchen 15":{
      name: "Mädchen 15",
      url_slug: "M15"
    },
    "Mädchen 13":{
      name: "Mädchen 13",
      url_slug: "M13"
    },
    "Mädchen 11":{
      name: "Mädchen 11",
      url_slug: "M11"
    }
  },
  Jungen: {
    "Jungen 18":{
      name: "Jungen 18",
      url_slug: "J18"
    },
    "Jungen 15":{
      name: "Jungen 15",
      url_slug: "J15"
    },
    "Jungen 13":{
      name: "Jungen 13",
      url_slug: "J13"
    },
    "Jungen 11":{
      name: "Jungen 11",
      url_slug: "J11"
    }
  },
  Seniorinnen: {
    "Seniorinnen 40":{
      name: "Seniorinnen 40",
      url_slug: "wS40"
    },
    "Seniorinnen 50":{
      name: "Seniorinnen 50",
      url_slug: "wS50"
    },
    "Seniorinnen 60":{
      name: "Seniorinnen 60",
      url_slug: "wS60"
    },
    "Seniorinnen 70":{
      name: "Seniorinnen 70",
      url_slug: "wS70"
    }
  },
  Senioren: {
    "Senioren 40":{
      name: "Senioren 40",
      url_slug: "mS40"
    },
    "Senioren 50":{
      name: "Senioren 50",
      url_slug: "mS50"
    },
    "Senioren 60":{
      name: "Senioren 60",
      url_slug: "mS60"
    },
    "Senioren 70":{
      name: "Senioren 70",
      url_slug: "mS70"
    }
  },
}
const JUGEND_SPIELKLASSEN = ["Mädchen","Jungen"]

const VERBÄNDE = {
  BaTTV: "Baden",
  ByTTV: "Bayern",
  TTVB: "Brandenburg",
  FTTB: "Bremen",
  HaTTV: "Hamburg",
  HeTTV: "Hessen",
  TTVMV: "Mecklenburg-Vorpommern",
  TTVN: "Niedersachsen",
  PTTV: "Pfalz",
  RTTVR: "Rheinland Rheinhessen",
  STTB: "Saarland",
  TTVSA: "Sachsen-Anhalt",
  SbTTV: "Südbaden",
  TTTV: "Thüringen",
  WTTV: "NRW",
  TTBW: "Baden Würrtemberg"
}
DEFAULT_VERBAND = "WTTV"


TTR_TOLERANZ = 50
TTR_TOLERANZ_INTERN = 35
TTR_TOLERANZ_JUGEND_BONUS = 35
TTR_TOLERANZ_DKADER_BONUS = 35
/* DEFINE GLOBAL CONSTANTS HERE */

const SPIELKLASSEN = {
  Herren: {
    "Herren":{
      name: "Herren",
      url_slug: "H"
    }
  },
  Damen: {
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
    },
  }
}
const JUGEND_SPIELKLASSEN = ["Mädchen","Jungen"]

const SOLLSTAERKEN = {
  Herren: 6,
  Damen: 4,
  Mädchen: 4,
  Jungen: 4,
  Seniorinnen: 4,
  Senioren: 4,
}

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
  TTTV: "Thüringen",
  WTTV: "NRW",
  TTBW: "Baden Württemberg"
}
DEFAULT_VERBAND = "WTTV"


TTR_TOLERANZ = 50
TTR_TOLERANZ_INTERN = 35
TTR_TOLERANZ_JUGEND_BONUS = 35
TTR_TOLERANZ_DKADER_BONUS = 35

GET_URL_SLUG_OF_VEREIN = (verein="") => {
  return verein.replace(/ /g,"-").replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/\./g,"-").replace(/\//g,"-")
}

COMPARE_HALBSERIEN = (a,b) => {
  // Sort halbserien descending
  // valid inputs: for a and b [Vorrunde|Rückrunde][ |-]d+[/]d*
  var a_split = " "
  if (a.includes("-")) { a_split = "-" }
  var b_split = " "
  if (b.includes("-")) { b_split = "-" }
  var a_sort_halbserie = a.split(a_split)[0]
  var a_sort_saison = parseInt(a.split(a_split)[1].replace("/",0), 10)
  var b_sort_halbserie = b.split(b_split)[0]
  var b_sort_saison = parseInt(b.split(b_split)[1].replace("/",0), 10)
  if ( (a_sort_saison - b_sort_saison) === 0 ){
    return a_sort_halbserie.localeCompare(b_sort_halbserie) // Vorrunde > Rückrunde
  } else {
    return b_sort_saison - a_sort_saison
  }
}
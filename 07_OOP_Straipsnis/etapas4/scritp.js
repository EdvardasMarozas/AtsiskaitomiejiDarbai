class Straipsnis {
  constructor(pavadinimas, antraste, paveiksliukas, tekstas) {
    this.pavadinimas = pavadinimas;
    this.antraste = antraste;
    this.paveiksliukas = paveiksliukas;
    this.tekstas = tekstas;
  }
  generavimas() {
    let isvedimas = `<h1>${this.pavadinimas}</h1> <br>
        <h4 style="width:50%">${this.antraste}</h4> <br>
        <img src= "${this.paveiksliukas}"; style="width:400px"> <br>
        <p style="width:40%"> ${this.tekstas} </p>`;
    return isvedimas;
  }
}

class StraipsnisRubrika extends Straipsnis {
  constructor(
    rubrikosPavadinimas,
    pavadinimas,
    antraste,
    paveiksliukas,
    tekstas,
    nuoroda
  ) {
    super(pavadinimas, antraste, paveiksliukas, tekstas);
    this.rubrikosPavadinimas = rubrikosPavadinimas;
    this.nuoroda = nuoroda;
  }
  generavimas() {
    let isvedimas = `<h2>${this.rubrikosPavadinimas}</h2>
        <h1> ${this.pavadinimas}</h1> <br>
        <h4 style="width:50%">${this.antraste}</h4> <br>
        <img src= "${this.paveiksliukas}"; style="width:400px"> <br>
        <p style="width:40%"> ${this.tekstas} </p>`;
    return isvedimas;
  }
  trumpesneVersija() {
    let x = this.antraste.toString().split(" ");
    let b = [];
    let trAntraste;
    if (x.length > 10) {
      for (let i = 0; i < 10; i++) {
        b.push(x[i]);
      }
      trAntraste = b.join(" ") + "...";
    }
    else{
      trAntraste = this.antraste;
    }
    let isvedimas = `<h1>${this.rubrikosPavadinimas}</h1> <br>
        <img src= "${this.paveiksliukas}"; style="width:100px"> <br>
        <h4 style="width:50%">${trAntraste} <a href ="${this.nuoroda}">Skaityti plačiau</a></h4>`;
    return isvedimas;
  }
}

const straipsnis1 = new StraipsnisRubrika(
  "Karas",
  "Po slapto tyrimo išaiškėjo reto įžūlumo afera: sunku patikėti, kas dėjosi per pandemija",
  "Per pandemijos įkarštį nelegaliai pasipelnyti sumaniusios vakcinacijos centro darbuotojos sulaukė atpildo. Kartu su jomis nuteistas ir prie aferos prisidėjęs vyras, padėjęs rasti žmones, kurie už pinigus norėjo įsigyti fiktyvius įrašus apie pasiskiepijimą nuo COVID-19.",
  "https://g.delfi.lt/images/pix/vakcinacijos-centras-vilniuje-86909333.jpg",
  "Vilniaus miesto apylinkės teisme šią savaitę paskelbtas nuosprendis, kuriuo vakcinacijos centre dirbusi registratorė Beata Vetrova pripažinta kalta dėl kyšininkavimo, už kyšininkavimą jai skirta 9000 eurų bauda, bet kadangi ji pripažino savo kaltę, be to, 39 dienas ikiteisminio tyrimo metu buvo suimta, bauda jai sumažinta iki 2100 eurų.",
  "./index1.html"
);
const straipsnis2 = new StraipsnisRubrika(
  "Kultūra",
  "10 faktų apie Nacionalinės premijos laureatą, skulptorių Rimantą Sakalauską",
  "„Kai atsigręžiu atgal ir pasižiūriu į tai, kas padaryta, galvoju, gal to ir užtenka mano laikui? Turiu kuo pasidžiaugti ir, svarbiausia, nė vieno darbo, kurio gėdyčiausi. Gal galima jau būtų atsipalaiduoti ir tiesiog būti likusias dienas, mėnesius ar metus... Tačiau tas vidinis motoras sukasi ir neleidžia man nurimti...“ – teigia žinomas skulptorius, Nacionalinės premijos laureatas Rimantas Sakalauskas.",
  "https://s1.15min.lt/images/photos/2023/11/06/original/sveciuose-pas-skulptoriu-rimanta-sakalauska-6548eef053ea2.jpg",
  "Lietuvos meno lauke debiutavęs išskirtiniais keramikiniais indais-skulptūromis, ilgainiui viešąją erdvę – kapines ir bažnyčias – jis papildė unikaliais kūriniais, kurie ir šiandien liudija šio menininko meistrystę ir talentą.",
  "./index2.html"
);
const straipsnis3 = new StraipsnisRubrika(
  "Menas",
  "Testas ne iš lengvųjų: ar atpažinsite garsius XX a. meno kūrinius?",
  "Šį kartą 15min testas skirtas pasitikrinti savo moderniosios XX amžiaus dailės žinias. Kiekvienas paveikslas paimtas iš skirtingos XX amžiaus dailės krypties, tad tai puiki proga atsiminti, kokie dailės stiliai dominavo XX amžiuje. Testas ne iš lengvųjų, tad pasiraitokite rankoves ir pirmyn į spalvingą modernizmą!",
  "https://s1.15min.lt/images/photos/2023/11/17/original/rene-magritte-paveikslas-zmogaus-sunus-65572cacc3c32.jpg",
  "19 a. pabaigoje kaip priešprieša saloniniam akademizmui Paryžiuje klostėsi impresionizmas, propagavęs plenerinę tapybą, tiesioginės tikrovės įspūdžio, akimirkos vaizdo perteikimą. Impresionistų tapymo būdui suteikti teorinį pagrindą bandė neoimpresionizmas. Impresionistams būdinga radikalus akademinių taisyklių laužymas, neįprastas koloritas, nauja ikonografija skatino dailės",
  "./index3.html"
);
const straipsnis4 = new StraipsnisRubrika(
  "Karas",
  "Prabilo apie naują Rusijos vadovybės taktiką",
  "Okupantai nenustoja bandyti apgulti Avdijivkos miestą Donecko regione, o Rusijos karinė vadovybė vis papildo išsenkančius šturmo dalinius.",
  "https://g.delfi.lt/images/pix/karas-ukrainoje-95025901.jpg",
  "Taip teigia Tavrijos kariuomenės grupuotės atstovas spaudai Oleksandras Štupunas, kalbėjęs nacionalinio teletilto eteryje. „Jei grubiai apibūdintume Rusijos generolų taktiką savo pavaldinių atžvilgiu, tai būtų „užimk poziciją arba mirk“, – sakė jis.",
  "./index4.html"
);
const straipsnis5 = new StraipsnisRubrika(
  "Sportas",
  "Serbai vaikščiojo peilio ašmenimis, bet pateko į Europos čempionatą",
  "2024 metų Europos futbolo čempionato atrankos varžybose kovas baigė C grupės, kurioje žaidė Lietuvos rinktinė, komandos.",
  "https://s1.15min.lt/images/photos/2023/11/19/original/milosas-veljkovicius-655a2f0a08fb0.jpg",
  "Kelialapį į Europos čempionatą šioje grupėje jau anksčiau buvo užsitikrinę Vengrijos futbolininkai, kurie šiandien namie priėmė Juodkalnijos komandą. Pastaroji galėjo tikėtis antrosios vietos ir kelialapio į prestižinį turnyrą, jei būtų laimėjusi Budapešte, o per kitas rungtynes antri žengę serbai būtų namie pralaimėję autsaideriams bulgarams.",
  "./index5.html"
);

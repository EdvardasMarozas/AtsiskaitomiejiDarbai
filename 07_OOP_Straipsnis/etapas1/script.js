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

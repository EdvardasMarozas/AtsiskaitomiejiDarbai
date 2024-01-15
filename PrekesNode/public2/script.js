const prekes = [
  {
    Pavadinimas: "Projektorius Philips PicoPix",
    Kaina: 615,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/402/phi/philips-picopix-max-one-compact-projektorius.jpg",
    Aprasymas:
      "Philips PicoPix yra labai naudinga ir issamu preke. Projektorius turi Full HD 1080p raišką, kas užtikrina aukštos kokybės vaizdą.",
  },
  {
    Pavadinimas: "Philips NeoPix 720 Namų projektorius",
    Kaina: 489,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/4/phi/philips-projektorius-neopix-720-full-hd.png",
    Aprasymas:
      "Philips NeoPix 720 Namų projektorius NPX720/INT yra puikus pasirinkimas norintiems mėgautis kokybišku vaizdu namuose arba renginiuose",
  },
  {
    Pavadinimas: "Philips PicoPix Micro 2 Mini Projektorius",
    Kaina: 345,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/368/phi/philips-picopix-micro-2-mini-led-projektorius.jpeg",
    Aprasymas:
      "Philips PicoPix Micro 2 Mini Projektorius PPX340/INT yra labai patogus ir kompaktiškas projektorius su stereo garsiakalbiais ir akumuliatoriumi.",
  },
  {
    Pavadinimas: "Projektorius Philips HD ready",
    Kaina: 499,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/4/phi/philips-projektorius-neopix-120-hd-ready.png",
    Aprasymas:
      "Philips NeoPix Ultra 2TV+ Namų Projektorius NPX644 yra puiki prekė, kuri turi daug privalumų.Tačiau yra vienas trūkumas - projektorius yra gana didelis ir sunkus.",
  },
  {
    Pavadinimas: "Philips Mobile Projektorius GoPix 1",
    Kaina: 335,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/4/phi/philips-mobile-projektorius-gopix-1-fwvga.png",
    Aprasymas:
      "Philips Mobile Projektorius GoPix 1 FWVGA (854x480), Juodas yra labai patogus ir kokybiškas projektorius.",
  },
  {
    Pavadinimas: "Projektorius Samsung The Freestyle Gen 2",
    Kaina: 585,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/572/sma/smart-projektorius-samsung-the-freestyle.png",
    Aprasymas:
      "The Freestyle 2nd Gen. geriausiai tinka filmams ar žaidimams, kai ypač svarbus - didelis, ryškus vaizdas ir tinkamas garsas.",
  },
];

let prekiuIsvedimas = "";
for (let i = 0; i < prekes.length; i++) {
  prekiuIsvedimas += `<div class="card" style="width: 20rem;">
<a href = "http://localhost:8080/prekes/${i}"><img src="${prekes[i].Paveiksliukas}" class="card-img-top" style="width: 12rem; height: 15vh;" alt="prekės_foto"></a>
<div class="card-body">
  <h5 class="card-title" style="font-size:medium"><a href = "http://localhost:8080/prekes/${i}">${prekes[i].Pavadinimas}</a></h5>
  <p class="card-text"><strong>${prekes[i].Kaina} &euro;</strong></p>
</div>
</div>`;
}
// document.getElementById("demo").innerHTML = prekiuIsvedimas;
export { prekes, prekiuIsvedimas };
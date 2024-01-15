const express = require("express");
const router = express.Router();
const prekes = [
  {
    Pavadinimas: "Projektorius Philips PicoPix",
    Kaina: 615,
    Paveiksliukas:
      "https://www.varle.lt/static/uploads/products/402/phi/philips-picopix-max-one-compact-projektorius.jpg",
    Aprasymas:
      "Philips PicoPix yra labai naudinga ir issami preke. Projektorius turi Full HD 1080p raišką, kas užtikrina aukštos kokybės vaizdą.",
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

// router.use(express.static("public2"));

router.get("/", (req, res) => {
  res.render("kitas.html");
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  if (prekes[id]) {
    res.render("preke", {
      prekesPavadinimas: prekes[id].Pavadinimas,
      prekesKaina: prekes[id].Kaina,
      prekesPaveiksliukas: prekes[id].Paveiksliukas,
      prekesAprasymas: prekes[id].Aprasymas,
    });
  } else {
    res.status(404).send("Prekė NOT FOUND");
  }
});

module.exports = router;

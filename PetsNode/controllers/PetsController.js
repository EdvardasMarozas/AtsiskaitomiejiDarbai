const _pets = require("../models/pets");
// var htmlspecialchars = require("htmlspecialchars");
var fs = require("node:fs/promises");

const { validationResult } = require("express-validator");
const {
  petValidateStore,
  petValidateUpdate,
} = require("../requests/PetsRequest");

// function validateText(txt, default_txt = "") {
//   if (txt == undefined) {
//     return default_txt;
//   } else {
//     return htmlspecialchars(txt.toString().trim());
//   }
// }

// function petValidate(req, pet = {}, specie = {}) {
//   let valid = true;
//   const messages = [];

//   if (pet) {
//     pet.name = validateText(req.body.name, pet.name);
//     pet.email = validateText(req.body.email, pet.email);
//   } else {
//     pet.name = validateText(req.body.name);
//     pet.name = validateText(req.body.email);
//   }
//   if (specie) {
//     specie.name = validateText(req.body.species, specie.name);
//   } else {
//     specie.name = validateText(req.body.species);
//   }

//   if (!pet.name) {
//     messages.push("Name is not specified");
//     valid = false;
//   }
//   if (!pet.email) {
//     messages.push("Email is not specified");
//     valid = false;
//   }
//   if (!specie.name) {
//     messages.push("Species is not specified");
//     valid = false;
//   }

//   if (req.file) {
//     const mimetypes = ["image/webp", "image/png", "image/jpeg"];
//     if (!mimetypes.includes(req.file.mimetype)) {
//       messages.push("Accepted file types: jpg, png, jpeg, webp");
//       valid = false;
//     }

//     if (req.file.size > 2 * 1024 * 1024) {
//       messages.push("Max. file size: 2 MB.");
//       valid = false;
//     }

//     pet.image = validateText(req.file.originalname);
//   }

//   return [pet, specie, valid, messages];
// }

module.exports = {
  showAll: async function (req, res, next) {
    try {
      const [pets, fields] = await _pets.getAll(req.db);

      res.render("Pets/allPets", { title: "Our Soldiers", pets: pets });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  showbyID: async function (req, res, next) {
    const validation = validationResult(req);

    if (validation.isEmpty()) {
      let ID = req.params.id;
      try {
        const [pet, fields] = await _pets.getById(req.db, ID);
        if (pet) {
          let d = pet.created_at;
          const created_at = d.toString().split(" ", 4).join(" ");
          const [totalBattles] = await _pets.totalBattles(req.db, pet.ID);
          const [battlesWon] = await _pets.battlesWon(req.db, pet.ID);
          const [battlesDrawn] = await _pets.battlesDrawn(req.db, pet.ID);
          const petSpecie = await _pets.getSpecie(req.db, ID);
          // let specieName;
          // petSpecie ? (specieName = petSpecie.name) : (specieName = "");
          res.render("Pets/showbyid", {
            title: "Pet - " + ID,
            pet: pet,
            specie: petSpecie,
            created_at: created_at,
            totalBattles: totalBattles,
            battlesWon: battlesWon,
            battlesDrawn: battlesDrawn,
          });
        } else {
          res.status(404).send("Not Found");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Server failure");
      }
    } else {
      res.status(404).send("Wrong Pet");
    }
  },
  create: function (req, res, next) {
    const old = req.session.old;
    const messages = req.session.messages;
    delete req.session.old;
    delete req.session.messages;
    res.render("pets/create", { old: old, messages: messages });
  },
  store: async function (req, res, next) {
    const [pet, valid, messages] = petValidateStore(req);
    if (valid) {
      try {
        console.log(pet.species);
        await _pets.diableKeyCheck(req.db);
        const petID = await _pets.create(req.db, pet);
        const specieID = await _pets.createSpecies(req.db, pet.species);
        await _pets.updateNewPetSpecie(req.db, specieID, petID);
        await _pets.updateAllPetSpecies(req.db, specieID, pet.species);
        await _pets.deleteSpiece(req.db, pet.species, specieID);
        await _pets.enableKeyCheck(req.db);
        console.log(pet.species);
        if (req.file) {
          const ext = {
            "image/webp": ".webp",
            "image/png": ".png",
            "image/jpeg": ".jpg",
          };
          let file_name =
            req.file.filename.slice(0, 6) +
            "_" +
            petID +
            ext[req.file.mimetype];
          await fs.rename(req.file.path, "public/images/" + file_name);
          await _pets.updateImage(req.db, petID, file_name);
        }
        res.redirect("/petwars");
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    } else {
      req.session.old = pet;
      req.session.messages = messages;
      if (req.file) {
        fs.rm(req.file.path);
      }
      res.redirect("/petwars/create");
    }
  },
  editpage: async function (req, res, next) {
    try {
      const [pets, fields] = await _pets.getAll(req.db);

      res.render("Pets/adminpanel", { title: "Pet List", pets: pets });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
  edit: async function (req, res, next) {
    let ID = req.params.id;

    try {
      const [pet] = await _pets.getById(req.db, ID);

      if (pet) {
        const old = req.session.old;
        const messages = req.session.messages;
        delete req.session.old;
        delete req.session.messages;
        const petSpecie = await _pets.getSpecie(req.db, ID);
        let specieName;
        petSpecie ? (specieName = petSpecie.name) : (specieName = "");

        res.render("Pets/edit", {
          title: "Pet edit page",
          pet: pet,
          old: old,
          messages: messages,
          specie: specieName,
        });
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
  update: async function (req, res, next) {
    let ID = req.params.id;
    let admin_ID = req.params.IDI;
    try {
      const [pet] = await _pets.getById(req.db, ID);
      if (pet) {
        const [pet_validated, specie, valid, messages] = petValidateUpdate(
          req,
          pet
        );

        if (valid) {
          await _pets.update(req.db, ID, pet_validated);
          await _pets.updateSpecie(req.db, specie.name, ID);

          if (req.file) {
            const ext = {
              "image/webp": ".webp",
              "image/png": ".png",
              "image/jpeg": ".jpg",
            };
            let file_name =
              req.file.filename.slice(0, 6) + "_" + ID + ext[req.file.mimetype];
            await fs.rename(req.file.path, "public/images/" + file_name);
            await _pets.updateImage(req.db, ID, file_name);
          }
          res.redirect("/petwars/pets/" + ID);
        } else {
          req.session.old = pet;
          req.session.messages = messages;
          if (req.file) {
            fs.rm(req.file.path);
          }
          res.redirect(
            req.header("Referer") ?? `/panel/${admin_ID}/${ID}/edit`
          );
        }
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
  delete: async function (req, res, next) {
    let ID = req.params.id;
    try {
      const [pet] = await _pets.getById(req.db, ID);
      if (pet) {
        const [result] = await _pets.delete(req.db, ID);
        res.redirect("/petwars/adminpanel/");
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
  index: async function (req, res, next) {
    try {
      const [number] = await _pets.getRandomID(req.db);
      const nr1 = number[0].ID;
      const nr2 = number[1].ID;
      const [pet1, fields] = await _pets.getById(req.db, nr1);
      const [pet2] = await _pets.getById(req.db, nr2);
      if (
        (req.header("Referer") == "http://localhost:3000/petwars")
      ) {
        // if  pet1 = false and pet2 = false pbandyti reikes
        console.log("tikrinam123");
        console.log(req.session.winner);
        const [battleStats] = await _pets.battleStats(req.db, pet1.ID, pet2.ID);
        const winnerID = req.session.winner;
        const loserID = req.session.loser;
        const [winner, fields] = await _pets.getById(req.db, winnerID);
        const [loser] = await _pets.getById(req.db, loserID);
        const oldPet1 = req.session.oldPet1;
        const oldPet2 = req.session.oldPet2;
        console.log(req.session)
        if (req.session.winner == undefined){
          await _pets.createBattle(req.db, oldPet1.ID, oldPet2.ID, `draw`);
        }
        delete req.session.oldPet1;
        delete req.session.oldPet2;
        delete req.session.winner;
        delete req.session.loser;
        req.session.oldPet1 = pet1;
        req.session.oldPet2 = pet2;
        // console.log(oldPet1.ID)
        // console.log(oldPet2.ID)
        // console.log("tarpas")
        // console.log(winner)
        // console.log(loser)
        res.render("Pets/index", {
          title: "Petwars",
          oldPet1: oldPet1,
          oldPet2: oldPet2,
          pet1: pet1,
          pet2: pet2,
          stat: battleStats,
          winner: winner,
          loser: loser,
        });
      } else {
        req.session.oldPet1 = pet1;
        req.session.oldPet2 = pet2;
        res.render("Pets/index", {
          title: "Petwars",
          pet1: pet1,
          pet2: pet2,
          oldPet1: false,
          oldPet2: false,
          winner: false,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  result: async function (req, res, next) {
    try {
      req.session.winner = req.body.winner;
      req.session.loser = req.body.loser;
      await _pets.createBattle(
        req.db,
        req.body.winner,
        req.body.loser,
        req.body.winner
      );
      if (req.header("/petwars")) {
        console.log("veikia");
      }
      res.redirect("/petwars");
      // res.render("Pets/index", { title: "Petwars", pet1: pet1, pet2: pet2, pets: twoPets, oldPet1: false, oldPet2: false});
      // res.redirect(req.header("Referer") ?? `/petwars/pets/${ID}/edit`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  mostWinningPets: async function (req, res, next) {
    try {
      const petsTotalBattles = [];
      const pets = [];
      const [petWins, fields] = await _pets.mostWinning(req.db);
      for (let i in petWins) {
        petsTotalBattles.push((await _pets.totalBattles(req.db, petWins[i].ID))[0]);
        pets.push((await _pets.getById(req.db, petWins[i].ID))[0]);
      }
      res.render("Pets/mostwinning", {
        title: "Winningest Pets",
        totalBattles: petsTotalBattles,
        petWins: petWins,
        pets: pets,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  mostLosingPets: async function (req, res, next) {
    try {
      const petsTotalBattles = [];
      const pets = [];
      const [petLosses, fields] = await _pets.mostLosing(req.db);
      for (let i in petLosses) {
        petsTotalBattles.push((await _pets.totalBattles(req.db, petLosses[i].ID))[0]);
        pets.push((await _pets.getById(req.db, petLosses[i].ID))[0]);
      }
      res.render("Pets/mostlosing", {
        title: "Losingest Pets",
        totalBattles: petsTotalBattles,
        petLosses: petLosses,
        pets: pets,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  mostTiedPets: async function (req, res, next) {
    try {
      const petsTotalBattles = [];
      const pets = [];
      const [petTied, fields] = await _pets.mostPeacefull(req.db);
      for (let i in petTied) {
        petsTotalBattles.push((await _pets.totalBattles(req.db, petTied[i].ID))[0]);
        pets.push((await _pets.getById(req.db, petTied[i].ID))[0]);
      }
      res.render("Pets/mostTied", {
        title: "Pets who have Tied the most",
        totalBattles: petsTotalBattles,
        petTied: petTied,
        pets: pets,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  weekWinner: async function (req, res, next) {
    try{
      const winner = await _pets.winnerOfTheWeek(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _pets.totalBattles(req.db, pet.ID);
      console.log(totalBattles);
      res.render("Pets/weekwinner", {
        title: "Winner Of The Week!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  monthWinner: async function (req, res, next) {
    try{
      const winner = await _pets.winnerOfTheMonth(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _pets.totalBattles(req.db, pet.ID);
      res.render("Pets/monthwinner", {
        title: "Winner Of The Month!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  yearWinner: async function (req, res, next) {
    try{
      const winner = await _pets.winnerOfTheYear(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _pets.totalBattles(req.db, pet.ID);
      res.render("Pets/yearwinner", {
        title: "Winner Of The Year!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
};

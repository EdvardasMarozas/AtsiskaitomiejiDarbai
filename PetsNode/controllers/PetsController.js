const _pets = require("../models/pets");
var fs = require("node:fs/promises");
const _battles = require("../models/battles");

const { validationResult } = require("express-validator");
const { petValidateStore } = require("../requests/PetsRequest");

module.exports = {
  showAllNewPets: async function (req, res, next) {
    try {
      const [pets, fields] = await _pets.getAllNewPets(req.db);

      res.render("Pets/allNewPets", {
        title: "Our Newest Soldiers!",
        pets: pets,
      });
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
          const [totalBattles] = await _battles.totalBattles(req.db, pet.ID);
          const [battlesWon] = await _battles.battlesWon(req.db, pet.ID);
          const [battlesDrawn] = await _battles.battlesDrawn(req.db, pet.ID);
          const petSpecie = await _pets.getSpecie(req.db, ID);

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
        await _pets.diableKeyCheck(req.db);
        const petID = await _pets.create(req.db, pet);
        const specieID = await _pets.createSpecies(req.db, pet.species);
        await _pets.updateNewPetSpecie(req.db, specieID, petID);
        await _pets.updateAllPetSpecies(req.db, specieID, pet.species);
        await _pets.deleteSpiece(req.db, pet.species, specieID);
        await _pets.enableKeyCheck(req.db);
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
        res.redirect("/petwars/pets/" + petID);
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
  index: async function (req, res, next) {
    try {
      const [number] = await _battles.getRandomID(req.db);
      const nr1 = number[0].ID;
      const nr2 = number[1].ID;
      const [pet1, fields] = await _pets.getById(req.db, nr1);
      const [pet2] = await _pets.getById(req.db, nr2);
      if (req.header("Referer") == "http://localhost:3000/petwars") {
        const [battleStats] = await _battles.battleStats(
          req.db,
          pet1.ID,
          pet2.ID
        );
        const winnerID = req.session.winner;
        const loserID = req.session.loser;
        const [winner, fields] = await _pets.getById(req.db, winnerID);
        const [loser] = await _pets.getById(req.db, loserID);
        const oldPet1 = req.session.oldPet1;
        const oldPet2 = req.session.oldPet2;
        if (req.session.winner == undefined) {
          await _battles.createBattle(req.db, pet1.ID, pet2.ID, `draw`);
        }
        delete req.session.oldPet1;
        delete req.session.oldPet2;
        delete req.session.winner;
        delete req.session.loser;
        req.session.oldPet1 = pet1;
        req.session.oldPet2 = pet2;
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
      await _battles.createBattle(
        req.db,
        req.body.winner,
        req.body.loser,
        req.body.winner
      );
      if (req.header("/petwars")) {
        console.log("veikia");
      }
      res.redirect("/petwars");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
};

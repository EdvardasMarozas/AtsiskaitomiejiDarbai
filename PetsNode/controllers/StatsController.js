const stats = require("../models/stats");
const _battles = require("../models/battles");
const _pets = require("../models/pets");

module.exports = {
  mostWinningPets: async function (req, res, next) {
    try {
      const petsTotalBattles = [];
      const pets = [];
      const [petWins, fields] = await stats.mostWinning(req.db);
      for (let i in petWins) {
        petsTotalBattles.push(
          (await _battles.totalBattles(req.db, petWins[i].ID))[0]
        );
        pets.push((await _pets.getById(req.db, petWins[i].ID))[0]);
      }
      res.render("Stats/mostwinning", {
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
      const [petLosses, fields] = await stats.mostLosing(req.db);
      for (let i in petLosses) {
        petsTotalBattles.push(
          (await _battles.totalBattles(req.db, petLosses[i].ID))[0]
        );
        pets.push((await _pets.getById(req.db, petLosses[i].ID))[0]);
      }
      res.render("Stats/mostlosing", {
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
      const [petTied, fields] = await stats.mostPeacefull(req.db);
      for (let i in petTied) {
        petsTotalBattles.push(
          (await _battles.totalBattles(req.db, petTied[i].ID))[0]
        );
        pets.push((await _pets.getById(req.db, petTied[i].ID))[0]);
      }
      res.render("Stats/mostTied", {
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
    try {
      const winner = await stats.winnerOfTheWeek(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _battles.totalBattles(req.db, pet.ID);
      console.log(totalBattles);
      res.render("Stats/weekwinner", {
        title: "Winner Of The Week!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  monthWinner: async function (req, res, next) {
    try {
      const winner = await stats.winnerOfTheMonth(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _battles.totalBattles(req.db, pet.ID);
      res.render("Stats/monthwinner", {
        title: "Winner Of The Month!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  yearWinner: async function (req, res, next) {
    try {
      const winner = await stats.winnerOfTheYear(req.db);
      const [pet] = await _pets.getById(req.db, winner.ID);
      const petSpecie = await _pets.getSpecie(req.db, pet.ID);
      const [totalBattles] = await _battles.totalBattles(req.db, pet.ID);
      res.render("Stats/yearwinner", {
        title: "Winner Of The Year!",
        pet: pet,
        specie: petSpecie,
        totalBattles: totalBattles,
        petWins: winner,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
};

const express = require("express");
const router = express.Router();
const StatsController = require("../controllers/StatsController");

router.get("/mostwinning", StatsController.mostWinningPets);
router.get("/mostlosing", StatsController.mostLosingPets);
router.get("/mostpeacefull", StatsController.mostTiedPets);
router.get("/weekwinner", StatsController.weekWinner);
router.get("/monthwinner", StatsController.monthWinner);
router.get("/yearwinner", StatsController.yearWinner);

module.exports = router;

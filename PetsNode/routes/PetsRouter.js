const express = require("express");
const router = express.Router();
const PetsController = require("../controllers/PetsController");
const PetRequest = require("../requests/PetsRequest");

router.get("/", PetsController.index);
router.post("/", PetsController.result);
router.get("/create", PetsController.create);
router.post("/create", PetRequest.storeValidation, PetsController.store);
router.get("/pets", PetsController.showAllNewPets);
router.get("/pets/:id", PetRequest.petIDValidation, PetsController.showbyID);

module.exports = router;

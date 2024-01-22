const express = require('express');
const router = express.Router();
const PetsController = require('../controllers/PetsController');
const PetRequest = require("../requests/PetsRequest");

router.get('/', PetsController.index);
router.get("/create", PetsController.create);
router.post("/post", PetRequest.storeValidation, PetsController.store);
router.post("/", PetsController.result);
router.get('/pets', PetsController.showAll);
router.get('/mostwinning', PetsController.mostWinningPets);
router.get('/mostlosing', PetsController.mostLosingPets);
router.get('/mostpeacefull', PetsController.mostTiedPets);
router.get('/weekwinner', PetsController.weekWinner);
router.get('/monthwinner', PetsController.monthWinner);
router.get('/yearwinner', PetsController.yearWinner);

// router.get('/adminpanel', PetsController.editpage);
router.get('/pets/:id', PetRequest.petIDValidation, PetsController.showbyID);
// router.get('/adminpanel/:id', PetRequest.petIDValidation, PetsController.showbyID);
// router.get('/adminpanel/:id/edit', PetsController.edit);
// router.put('/adminpanel/:id', PetRequest.updateValidation, PetsController.update);
// router.delete('/adminpanel/:id', PetsController.delete);
// router.get('/result', )

module.exports = router;
const express = require('express');
const router = express.Router();
const PetsController = require('../controllers/PetsController');
const PetRequest = require("../requests/PetsRequest");

router.get('/', PetsController.index);
router.get("/create", PetsController.create);
router.post("/post", PetRequest.storeValidation, PetsController.store);
router.post("/", PetsController.result);
router.get('/pets', PetsController.showAll);
// router.get('/adminpanel', PetsController.editpage);
router.get('/pets/:id', PetRequest.petIDValidation, PetsController.showbyID);
// router.get('/adminpanel/:id', PetRequest.petIDValidation, PetsController.showbyID);
// router.get('/adminpanel/:id/edit', PetsController.edit);
// router.put('/adminpanel/:id', PetRequest.updateValidation, PetsController.update);
// router.delete('/adminpanel/:id', PetsController.delete);
// router.get('/result', )

module.exports = router;
const express = require('express');
const router = express.Router();
const PetsController = require('../controllers/PetsController');

router.get('/', PetsController.index)
router.get("/create", PetsController.create);
router.post("/", PetsController.store);
router.get('/pets', PetsController.showAll);
router.get('/adminpanel', PetsController.editpage);
router.get('/pets/:id', PetsController.showbyID);
router.get('/adminpanel/:id', PetsController.showbyID);
router.get('/adminpanel/:id/edit', PetsController.edit);
router.put('/adminpanel/:id', PetsController.update);
router.delete('/adminpanel/:id', PetsController.delete);
// router.get('/result', )

module.exports = router;
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const PetRequest = require("../requests/PetsRequest");
const AdminRequest = require("../requests/AdminRequest");

router.get("/login", AdminController.login);
router.post("/login", AdminRequest.loginValidation, AdminController.loginPost);
router.get("/register", AdminController.register);
router.post("/register", AdminRequest.registerValidation, AdminController.registerPost);
router.get("/logout", AdminController.logout);
router.get("/panel/:IDI", AdminRequest.adminIDValidation, AdminController.panel);
router.get('/panel/:IDI/:id/edit', AdminController.edit);
router.put('/panel/:IDI/:id', PetRequest.updateValidation, AdminController.update);
router.delete('/panel/:IDI/:id', AdminController.delete);

module.exports = router;

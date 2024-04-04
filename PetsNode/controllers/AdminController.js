const _admin = require("../models/admin");
const _pets = require("../models/pets");
var fs = require("node:fs/promises");

const { validationResult } = require("express-validator");
const { adminValidate } = require("../requests/AdminRequest");
const { petValidateUpdate } = require("../requests/PetsRequest");

var bcrypt = require("bcrypt");

module.exports = {
  login: async function (req, res, next) {
    const old = req.session.old;
    const messages = req.session.messages;
    delete req.session.old;
    delete req.session.messages;

    res.render("Admin/login", {
      title: "Admin log In",
      old: old,
      messages: messages,
    });
  },
  loginPost: async function (req, res, next) {
    const [admin, valid, messages] = adminValidate(req);

    if (valid) {
      try {
        let [db_admin] = await _admin.getByEmail(req.db, admin.email);
        if (db_admin) {
          if (await bcrypt.compare(admin.password, db_admin.password)) {
            req.session.admin_email = db_admin.email;
            req.session.admin_id = db_admin.id;

            res.redirect("/panel/" + db_admin.id);
          } else {
            messages.push("Incorrect Password!");

            req.session.old = admin;
            req.session.messages = messages;
            res.redirect("/login");
          }
        } else {
          messages.push("Email not Found");

          req.session.old = admin;
          req.session.messages = messages;
          res.redirect("/login");
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    } else {
      req.session.old = admin;
      req.session.messages = messages;
      res.redirect("/login");
    }
  },
  register: async function (req, res, next) {
    const old = req.session.old;
    const messages = req.session.messages;
    delete req.session.old;
    delete req.session.messages;

    res.render("Admin/register", {
      title: "Admin Registration",
      old: old,
      messages: messages,
    });
  },
  registerPost: async function (req, res, next) {
    const [admin, valid, messages] = adminValidate(req);
    if (valid) {
      try {
        let [db_admin] = await _admin.getByEmail(req.db, admin.email);
        if (db_admin) {
          messages.push("This email is currently in use");

          req.session.old = admin;
          req.session.messages = messages;
          res.redirect("/register");
        } else {
          let password_hash = await bcrypt.hash(admin.password, 10);

          let admin_id = await _admin.createAdmin(req.db, {
            email: admin.email,
            password: password_hash,
          });
          if (admin_id) {
            req.session.admin_id = admin_id;
            req.session.admin_email = admin.email;

            res.redirect("/panel/" + admin_id);
          } else {
            messages.push("Registration failure");

            req.session.old = admin;
            req.session.messages = messages;
            res.redirect("/register");
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    } else {
      req.session.old = admin;
      req.session.messages = messages;
      res.redirect("/register");
    }
  },
  logout: async function (req, res, next) {
    delete req.session.admin_id;
    delete req.session.admin_email;
    res.redirect("/login");
  },
  panel: async function (req, res, next) {
    const validation = validationResult(req);
    if (validation.isEmpty()) {
      let id = req.params.IDI;

      if (req.session.admin_id) {
        if (req.session.admin_id == id) {
          try {
            const [admin, fields] = await _admin.getById(req.db, id);
            const [pets] = await _pets.getAll(req.db);

            if (admin) {
              res.render("Admin/panel", {
                title: "Admin Panel",
                pets: pets,
                adminID: admin.id,
              });
            } else {
              res.status(404).send("Not Found");
            }
          } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
          }
        } else {
          res.status(403).send("Access denied");
        }
      } else {
        res.status(403).send("Log in first! <a href='/login'> login</a>");
      }
    } else {
      res.status(404).send("Wrong admin ID");
    }
  },
  edit: async function (req, res, next) {
    let ID = req.params.id;
    const validation = validationResult(req);
    if (validation.isEmpty()) {
      let adminID = req.params.IDI;
      if (req.session.admin_id) {
        if (req.session.admin_id == adminID) {
          try {
            const [admin, fields] = await _admin.getById(req.db, adminID);
            const [pet] = await _pets.getById(req.db, ID);

            if (pet) {
              const old = req.session.old;
              const messages = req.session.messages;
              delete req.session.old;
              delete req.session.messages;
              const petSpecie = await _pets.getSpecie(req.db, ID);
              let specieName;
              petSpecie ? (specieName = petSpecie.name) : (specieName = "");

              res.render("Admin/edit", {
                title: "Pet edit page",
                pet: pet,
                old: old,
                messages: messages,
                specie: specieName,
                adminID: admin.id,
              });
            } else {
              res.status(404).send("Not Found");
            }
          } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
          }
        } else {
          res.status(403).send("Access denied");
        }
      } else {
        res.status(403).send("Log in first! <a href='/login'> login</a>");
      }
    } else {
      res.status(404).send("Wrong admin ID");
    }
  },
  update: async function (req, res, next) {
    let ID = req.params.id;
    let admin_ID = req.params.IDI;
    try {
      const [pet] = await _pets.getById(req.db, ID);
      if (pet) {
        const [pet_validated, valid, messages] = petValidateUpdate(req, pet);
        if (valid) {
          await _admin.updatePet(req.db, ID, pet_validated);
          await _pets.updateSpecie(req.db, pet_validated.species, ID);
          const species = await _pets.getSpecie(req.db, ID);
          let amount;
          if(species != undefined ){
            amount = await _pets.getSpecieAmount(req.db, species.name);
          }
          if ((species === undefined) | (amount > 1)) {
            await _pets.diableKeyCheck(req.db);
            const specieID = await _pets.createSpecies(
              req.db,
              pet_validated.species
            );
            await _pets.updateNewPetSpecie(req.db, specieID, ID);
            await _pets.updateAllPetSpecies(req.db, specieID, pet.species);
            await _pets.deleteSpiece(req.db, pet_validated.species, specieID);
            await _pets.enableKeyCheck(req.db);
          }
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
          res.redirect(`/panel/${admin_ID}/`);
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
    let admin_ID = req.params.IDI;
    try {
      const [pet] = await _pets.getById(req.db, ID);
      const foto = await _pets.getPhoto(req.db, ID);
      if (pet) {
        fs.unlink('public/images/' + foto, err => {
          if (err) console.log(err);
          else {
              console.log("\nDeleted file:" + foto);
          }
      });
        await _admin.deletePet(req.db, ID);
        res.redirect(`/panel/${admin_ID}/`);
      } else {
        res.status(404).send("Not Found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  },
};

const _pets = require("../models/pets");
var htmlspecialchars = require("htmlspecialchars");
var fs = require("node:fs/promises");

function validateText(txt, default_txt = "") {
  if (txt == undefined) {
    return default_txt;
  } else {
    return htmlspecialchars(txt.toString().trim());
  }
}

function petValidate(req, pet = {}, specie = {}) {
  let valid = true;
  const messages = [];

  if (pet) {
    pet.name = validateText(req.body.name, pet.name);
    pet.email = validateText(req.body.email, pet.email);
  } else {
    pet.name = validateText(req.body.name);
    pet.name = validateText(req.body.email);
  }
  if (specie) {
    specie.name = validateText(req.body.species, specie.name);
  } else {
    specie.name = validateText(req.body.species);
  }

  if (!pet.name) {
    messages.push("Name is not specified");
    valid = false;
  }
  if (!pet.email) {
    messages.push("Email is not specified");
    valid = false;
  }
  if (!specie.name) {
    messages.push("Species is not specified");
    valid = false;
  }

  if (req.file) {
    const mimetypes = ["image/webp", "image/png", "image/jpeg"];
    if (!mimetypes.includes(req.file.mimetype)) {
      messages.push("Accepted file types: jpg, png, jpeg, webp");
      valid = false;
    }

    if (req.file.size > 2 * 1024 * 1024) {
      messages.push("Max. file size: 2 MB.");
      valid = false;
    }

    pet.image = validateText(req.file.originalname);
  } else {
    messages.push("Photo is not given");
    valid = false;
  }

  return [pet, specie, valid, messages];
}

module.exports = {
  showAll: async function (req, res, next) {
    try {
      const [pets, fields] = await _pets.getAll(req.db);

      res.render("Pets/allPets", { title: "Pet list", pets: pets });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  showbyID: async function (req, res, next) {
    let ID = req.params.id;
    try {
      const [pet, fields] = await _pets.getById(req.db, ID);
      let d = pet.created_at;
      const created_at = d.toString().split(" ", 4).join(" ");

      res.render("Pets/showbyid", {
        title: "Pet - " + ID,
        pet: pet,
        created_at: created_at,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
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
    const [pet, specie, valid, messages] = petValidate(req);
    let ID = req.params.id;
    if (valid) {
      try {
        const petID = await _pets.create(req.db, pet);
        await _pets.createSpecies(req.db, specie);
        await _pets.updateSpecies(req.db, specie, ID);
        console.log(req.params.id);

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

      res.render("Pets/adminpanel", { title: "Pet list", pets: pets });
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

        res.render("Pets/edit", {
          title: "Pet edit page",
          pets: pet,
          old: old,
          messages: messages,
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
    try {
      const [pet] = await _pets.getById(req.db, ID);
      if (pet) {
        const [pet_validated, valid, messages] = petValidate(req, _pets);

        if (valid) {
          const result = await _pets.update(req.db, ID, pet_validated);

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
          req.session.old = book;
          req.session.messages = messages;
          if (req.file) {
            fs.rm(req.file.path);
          }
          res.redirect(req.header("Referer") ?? `/petwars/pets/${ID}/edit`);
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
      const oldPet1 = pet1;
      const oldPet2 = pet2;
      if (req.header("http://localhost:3000/petwars/")) {
        res.render("Pets/result", { title: "Petwars", pet1: oldPet1, pet2: oldPet2 });
      } else {
        res.render("Pets/index", { title: "Petwars", pet1: pet1, pet2: pet2 });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Server failure");
    }
  },
  // result: async function (req, res, next) {
  //   try {
  //     const [vote] = await _pets.createBattle(req.db, this.index.pet1, this.index.pet2)
  //     if(req.header("/petwars")){
  //       res.render("Pets/result", {})
  //     }
  //     // res.redirect(req.header("Referer") ?? `/petwars/pets/${ID}/edit`);
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send("Server failure");
  //   }
  // }
};

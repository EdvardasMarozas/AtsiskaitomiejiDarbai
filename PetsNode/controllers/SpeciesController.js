const species = require("../models/species");
var htmlspecialchars = require("htmlspecialchars");
var fs = require("node:fs/promises");

function validateText(txt, default_txt = "") {
  if (txt == undefined) {
    return default_txt;
  } else {
    return htmlspecialchars(txt.trim());
  }
}

function speciesValidate(req, species = {}) {
  let valid = true;
  const messages = [];

  if (species) {
    species.name = validateText(req.body.name, species.name);
  } else {
    species.name = validateText(req.body.name);
  }

  if (!species.name) {
    messages.push("Species name is not specified");
    valid = false;
  }

  return [species, valid, messages];
}

module.exports = {
  store: async function (req, res, next) {
    const [species, valid, messages] = speciesValidate(req);

    if (valid) {
      try {
        const specieID = await species.create(req.db, species);
        
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
};

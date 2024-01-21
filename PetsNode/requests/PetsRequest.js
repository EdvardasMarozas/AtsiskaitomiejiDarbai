const { param, body, validationResult } = require("express-validator");
var htmlspecialchars = require("htmlspecialchars");

const validateText = (txt, default_txt = "") => {
  if (txt == undefined) {
    return default_txt;
  } else {
    return htmlspecialchars(txt.trim());
  }
};

const validateImage = (req) => {
  let image_name = "";
  let valid = true;
  const messages = [];

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

    image_name = validateText(req.file.originalname);
  }

  return [image_name, valid, messages];
};

module.exports = {
  petValidateUpdate: (req, pet = {}) => {
    let valid = true;
    const messages = [];

    const validation = validationResult(req);
    console.log("validacija");
    console.log(validation);
    console.log(req.body);
    
    pet.name = req.body.name ?? pet.name;
    pet.email = req.body.email ?? pet.email;
    pet.species = req.body.species ?? pet.species;
    
    if (!validation.isEmpty()) {
      console.log(validation.array());
      for (let i of validation.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }

    const [image, image_valid, image_messages] = validateImage(req);
    if (image) {
        pet.image = image;
        if (!image_valid) {
            valid = false;
            messages.push(...image_messages);
        }
    }

    return [pet, valid, messages];
  },
  petValidateStore: (req) => {
    let valid = true;
    const messages = [];

    const validation = validationResult(req);

    // console.log("validacija");
    // console.log(validation);
    // console.log(req.body);

    const pet = req.body;

    if (!validation.isEmpty()) {
    //     console.log("validation array")
    //   console.log(validation.array());
      for (let i of validation.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }

    const [image, image_valid, image_messages] = validateImage(req);
    if (image) {
        pet.image = image;
        if (!image_valid) {
            valid = false;
            messages.push(...image_messages);
        }
    } else {
        messages.push("Photo Not Given!");
        valid = false;
    }

    return [pet, valid, messages];
  },
  // naujos knygos sukūrimo validavimo taisyklės
  petIDValidation: [
    param("id").trim().escape().isInt().withMessage("Wrong Pet ID!"),
  ],
  // naujos knygos sukūrimo validavimo taisyklės
  storeValidation: [
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is not specified!")
      .isLength({ min: 2 })
      .withMessage("Name is too short!"),
    //   body("title").trim().escape().optional().isLength({ min: 5 }).withMessage('Pavadinimas per trumpas'),
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is not specified!")
      .isEmail()
      .withMessage("Invalid email address!"),
    body("species")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Species is not specified")
      .isLength({ min: 2 })
      .withMessage("Species is too short!")
  ],
  // naujos knygos sukūrimo validavimo taisyklės
  updateValidation: [
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is not specified!")
      .isLength({ min: 2 })
      .withMessage("Name is too short!"),
    //   body("title").trim().escape().optional().isLength({ min: 5 }).withMessage('Pavadinimas per trumpas'),
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is not specified!")
      .isEmail()
      .withMessage("Invalid email address!"),
    body("species")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Species is not specified!")
      .isLength({ min: 2 })
      .withMessage("Species is too short!")
  ],
};

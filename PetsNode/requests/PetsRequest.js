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
      messages.push("Neleistinas failo tipas.");
      valid = false;
    }

    if (req.file.size > 2 * 1024 * 1024) {
      messages.push("Galima įkelti failus tik iki 2MB.");
      valid = false;
    }

    image_name = validateText(req.file.originalname);
  } 

  return [image_name, valid, messages];
};

module.exports = {
  bookValidateUpdate: (req, book = {}) => {
    let valid = true;
    const messages = [];

    const validacija = validationResult(req);
    console.log("validacija");
    console.log(validacija);
    console.log(req.body);

    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.pages = req.body.pages ?? book.pages;
    book.date = req.body.date ?? book.date;
    book.genre = req.body.genre ?? book.genre;

    if (!validacija.isEmpty()) {
      // console.log(validacija.array());
      for (let i of validacija.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }

    const [image, image_valid, image_messages] = validateImage(req);
    if (image) {
        book.image = image;
        if (!image_valid) {
            valid = false;
            messages.push(...image_messages);
        }
    }

    return [book, valid, messages];
  },
  bookValidateStore: (req) => {
    let valid = true;
    const messages = [];

    const validacija = validationResult(req);

    // console.log("validacija");
    // console.log(validacija);
    // console.log(req.body);

    const book = req.body;

    if (!validacija.isEmpty()) {
      // console.log(validacija.array());
      for (let i of validacija.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }

    const [image, image_valid, image_messages] = validateImage(req);
    if (image) {
        book.image = image;
        if (!image_valid) {
            valid = false;
            messages.concat(...image_messages);
        }
    }

    return [book, valid, messages];
  },
  // naujos knygos sukūrimo validavimo taisyklės
  bookIDValidation: [
    param("id").trim().escape().isInt().withMessage("Neteisingas knygos id"),
  ],
  // naujos knygos sukūrimo validavimo taisyklės
  storeValidation: [
    body("title")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Nenurodytas pavadinimas")
      .isLength({ min: 5 })
      .withMessage("Pavadinimas per trumpas"),
    //   body("title").trim().escape().optional().isLength({ min: 5 }).withMessage('Pavadinimas per trumpas'),
    body("author")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Nenurodytas autorius"),
    body("pages")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Nenurodytas puslapių skaičius")
      .isNumeric()
      .withMessage("Puslapių skaičius turi būti skaičius"),
    body("date")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Nenurodyti metai")
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Metai turi būti nurodyti nuo 1900 iki 2030"),
    body("genre").trim().escape().notEmpty().withMessage("Nenurodytas žanras"),
  ],
  // naujos knygos sukūrimo validavimo taisyklės
  updateValidation: [
    body("title")
      .trim()
      .escape()
      .optional()
      .isLength({ min: 5 })
      .withMessage("Pavadinimas per trumpas"),
    //   body("title").trim().escape().optional().isLength({ min: 5 }).withMessage('Pavadinimas per trumpas'),
    body("author").trim().escape().optional(),
    body("pages")
      .trim()
      .escape()
      .optional()
      .isNumeric()
      .withMessage("Puslapių skaičius turi būti skaičius"),
    body("date")
      .trim()
      .escape()
      .optional()
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Metai turi būti nurodyti nuo 1900 iki 2030"),
    body("genre").trim().escape().optional(),
  ],
};

const { param, body, validationResult } = require("express-validator");

module.exports = {
  userValidate: (req) => {
    let valid = true;
    const messages = [];

    const validacija = validationResult(req);
    const user = req.body;

    if (!validacija.isEmpty()) {
      for (let i of validacija.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }

    return [user, valid, messages];
  },

  // vartotojo id validavimo taisyklės
  userIDValidation: [
    param("id").trim().escape().isInt().withMessage("Neteisingas vartotojo id"),
  ],
  // naujo vartotojo sukūrimo validavimo taisyklės
  registerValidation: [
    body("email")
      .trim()
      .escape()
      .notEmpty().withMessage("Nenurodytas el. pašto adresas")
      .isEmail().withMessage("Neteisingas el. pašto adresas"),
    body("password")
      .trim()
      .notEmpty().withMessage("Nenurodytas slaptažodis")
      .isLength({ min: 6 }).withMessage("Slaptažodis turi būti bent 6 simbolių ilgio"),
    body("password_confirm")
      .trim()
      .notEmpty().withMessage("Nenurodytas slaptažodžio pakartojimas")
      .custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage("Nesutampa slaptažodžiai"),
  ],
  // prisijungimo validavimo taisyklės
  loginValidation: [
    body("email")
      .trim()
      .escape()
      .notEmpty().withMessage("Nenurodytas el. pašto adresas")
      .isEmail().withMessage("Neteisingas el. pašto adresas"),
    body("password")
      .trim()
      .notEmpty().withMessage("Nenurodytas slaptažodis"),
  ],
};

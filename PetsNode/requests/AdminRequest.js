const { param, body, validationResult } = require("express-validator");

module.exports = {
  adminValidate: (req) => {
    let valid = true;
    const messages = [];
    const validation = validationResult(req);
    const admin = req.body;

    if (!validation.isEmpty()) {
      for (let i of validation.array()) {
        messages.push(i.msg);
      }
      valid = false;
    }
    return [admin, valid, messages];
  },

  adminIDValidation: [
    param("IDI").trim().escape().isInt().withMessage("Wrong admin ID!"),
  ],
  registerValidation: [
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is not specified!")
      .isEmail()
      .withMessage("Invalid email address!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is not specified!")
      .isLength({ min: 5 })
      .withMessage("Password has to contain atleast 5 letters!"),
    body("password_confirm")
      .trim()
      .notEmpty()
      .withMessage("Password confirmation is not given!")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Passwords do not match!"),
  ],
  loginValidation: [
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is not specified!")
      .isEmail()
      .withMessage("Invalid email address!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is not specified!"),
  ],
};

const {
  validationResult,
  body,
  check,
} = require("express-validator");
const multer = require("multer");

const errorRepons = (req, res, next) => {
  const httpResponse = {
    success: false,
    data: null,
    messages: [],
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors
      .array()
      .forEach((error) => httpResponse.messages.push(`${error.msg}`));
    res.status(422);
    return res.send(httpResponse);
  }
  return next();
};

let uploadErrors = "";

const checkUpload = (err, next) => {
  if (err instanceof multer.MulterError) {
    uploadErrors = err.message;
  } else if (err) {
    uploadErrors = "file is required to be an image";
  }
  return next();
};
const nameValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required for the name")
    .escape()
    .notEmpty()
    .withMessage("Name can not be empty!")
    .bail(),
  errorRepons,
];

const titleValidation = [
  body("title")
    .trim()
    .isLength({ min: 3 , max:255 })
    .withMessage("Required characters for the title are between 3 and 255!")
    .escape()
    .notEmpty()
    .withMessage("title can not be empty!")
    .bail(),
  errorRepons,
];
const contentValidation = [
  body("content")
    .trim()
    .isLength({ min: 3 , max:500 })
    .withMessage("Required characters for the content are between 3 and 500!")
    .escape()
    .notEmpty()
    .withMessage("Content can not be empty!")
    .bail(),
  errorRepons,
];

const codeValidation = [
  body("code")
    .trim()
    .isLength({ max: 3 })
    .withMessage("Maximum 3 characters required for the code")
    .escape()
    .notEmpty()
    .withMessage("code can not be empty!")
    .bail(),
  errorRepons,
];

const languageDirectionValidation = [
  body("direction")
    .trim()
    .isLength({ max: 3 })
    .withMessage("Maximum 3 characters required for the direction")
    .escape()
    .notEmpty()
    .withMessage("direction can not be empty!")
    .bail(),
  errorRepons,
];

const emailValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address!")
    .notEmpty()
    .withMessage("Email can not be empty!")
    .bail(),
  errorRepons,
];
const passwordValidation = [
  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "Password should be at least 6 charaters and contains capital, small ,numbers and spical charaters"
    )
    .notEmpty()
    .withMessage("Password can not be empty!"),
  errorRepons,
];

const phoneValdation = [
  body("phone")
    .isLength({ min: 6 })
    .optional({ nullable: true })
    .withMessage("Minimum 6 characters required for the phone!"),
  errorRepons,
];

const bioValdation = [
  body("bio")
    .isLength({ min: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the bio!"),
  errorRepons,
];

const descriptionValdation = [
  body("description")
    .isLength({ max: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the description!"),
  errorRepons,
];

const addressValdation = [
  body("address")
    .isLength({ max: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the address!"),
  errorRepons,
];

const imageValdation = [
  check("img")
    .custom((value, { req }) => {
      if (req.file) {
        return true;
      }
      return false;
    })
    .withMessage(function () {
      return `The icon is invalid: ${uploadErrors?.toLocaleLowerCase() || "You sholud upload image up to 1MB"}`;
    }),
  errorRepons,
];

const logoValdation = [
  check("img")
    .custom((value, { req }) => {
      if (req?.files?.logo[0]) {
        return true;
      }
      return false;
    })
    .withMessage(function () {
      return `The logo is invalid: ${uploadErrors?.toLocaleLowerCase() || "You sholud upload image up to 1MB"}`;
    }),
  errorRepons,
];
const bannerValdation = [
  check("img")
    .custom((value, { req }) => {
      if (req?.files?.banner[0]) {
        return true;
      }
      return false;
    })
    .withMessage(function () {
      return `The banner image is invalid: ${uploadErrors?.toLocaleLowerCase() || "You sholud upload image up to 1MB"}`;
    }),
  errorRepons,
];
module.exports = {
  nameValidation,
  emailValidation,
  passwordValidation,
  phoneValdation,
  imageValdation,
  bioValdation,
  addressValdation,
  logoValdation,
  bannerValdation,
  descriptionValdation,
  languageDirectionValidation,
  codeValidation,
  titleValidation,
  contentValidation,
  checkUpload,
};

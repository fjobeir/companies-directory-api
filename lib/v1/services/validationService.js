const {
  validationResult,
  body,
  check,
} = require("express-validator");
const multer = require("multer");

const errorResponse = (req, res, next) => {
  const httpResponse = {
    success: false,
    data: null,
    messages: [],
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors
      .array()
      .forEach((error) => httpResponse.messages.push(req.t(error.msg)));
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
  errorResponse,
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
  errorResponse,
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
  errorResponse,
];
const commentValidation = [
  body("comment")
    .trim()
    .isLength({ min: 0 , max:500 })
    .withMessage("Required characters for the content are between 3 and 500!")
    .escape(),
  errorResponse,
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
  errorResponse,
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
  errorResponse,
];

const emailValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("errors.email")
    .notEmpty()
    .withMessage("errors.email")
    .bail(),
  errorResponse,
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
  errorResponse,
];

const phoneValdation = [
  body("phone")
    .isLength({ min: 6 })
    .optional({ nullable: true })
    .withMessage("Minimum 6 characters required for the phone!"),
  errorResponse,
];

const bioValdation = [
  body("bio")
    .isLength({ min: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the bio!"),
  errorResponse,
];

const descriptionValdation = [
  body("description")
    .isLength({ max: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the description!"),
  errorResponse,
];

const addressValdation = [
  body("address")
    .isLength({ max: 250 })
    .optional({ nullable: true })
    .withMessage("Maxmium 250 characters required for the address!"),
  errorResponse,
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
      return `The icon is invalid: ${uploadErrors?.toLocaleLowerCase()}`;
    }),
  errorResponse,
];

const logoValdation = [
  check("logo")
    .custom((value, { req }) => {
      if (req?.files?.logo[0]) {
        return true;
      }
      return false;
    })
    .withMessage(function () {
      return `The logo is invalid: ${uploadErrors?.toLocaleLowerCase()}`;
    }),
  errorResponse,
];
const bannerValdation = [
  check("banner")
    .custom((value, { req }) => {
      if (req?.files?.banner[0]) {
        return true;
      }
      return false;
    })
    .withMessage(function () {
      return `The banner image is invalid: ${uploadErrors?.toLocaleLowerCase()}`;
    }),
  errorResponse,
];
const dateValidation = (date) => {
  return /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(date)
}
const dateAfter = (date1, date2) => {
  return date2 >= date1
}
const urlValidation = (url) => {
  return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(url)
}
let contactError = ''
const contactValidation = [
  body('value').custom((value, { req }) => {
    switch (req.body.type) {
        // case 'phone':
        //     return phoneValdation(value)
        case 'email':
            
            return emailValidation(value)
        case 'url':
            contactError = 'The URL is invalid'
            return urlValidation(value)
        case 'tiktok':
            return urlValidation(value)
        default:
            return false
    }
  }).withMessage(() => contactError),
  errorResponse
]
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
  commentValidation,
  contactValidation,
  checkUpload,
  dateValidation,
  dateAfter,
  urlValidation,
  errorResponse
};

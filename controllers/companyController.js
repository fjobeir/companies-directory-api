const models = require("../models");
const { verifyPassword, hashPassword } = require("../services/passwordService");
const {
  validateEmail,
  validateName,
  validatePassword,
} = require("../services/validationService");
const { companyTransformer, companiesTransformer } = require("../transformers/company");
const { getInstanceById } = require("../services/modelService");
const { getToken } = require("../services/tokenService");

const store = async (req, res) => {
  const result = {
    success: true,
    messages: [],
    data: [],
  };
  const {
    name = "",
    email = "",
    password = "",
    categoryId = 2,
    provinceId = 2,
    cityId = 2,
  } = req.body;

  if (!validateName(name)) {
    result.success = false;
    result.messages.push("Please enter a vaild name");
  }
  if (!validateEmail(email)) {
    result.success = false;
    result.messages.push("Please enter a vaild email");
  }
  if (!validatePassword(password)) {
    result.success = false;
    result.messages.push("Please enter a vaild password");
  }
  if (!result.success) {
    // Validation field
    return res.send(result);
  }

  const [account, created] = await models.Company.findOrCreate({
    where: { email },
    defaults: {
      name,
      password: hashPassword(password),
      categoryId,
      provinceId,
      cityId,
    },
  });
  if (created) {
    result.messages.push("Account Created Successfully");
  } else {
    result.success = false;
    result.messages.push("You are alredy registered");
  }

  return res.send(result);
};

const login = async (req, res) => {
  const result = {
    success: true,
    messages: [],
    data: [],
  };
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    result.success = false;
    result.messages.push("Please enter a vaild email");
  }
  if (!validatePassword(password)) {
    result.success = false;
    result.messages.push("Please enter a vaild password");
  }
  if (!result.success) {
    return res.send(result);
  }

  const companyUser = await models.Company.findOne({
    where: { email },
  });
  if (companyUser) {
    if (verifyPassword(password, companyUser.password)) {
      result.data = companyTransformer(companyUser);
      result.messages.push("Logged in successfully");
      result.token = getToken({
        id: companyUser.id,
        type: 'company'
      })
    } else {
      (result.success = false), result.messages.push("invalid password ! ");
    }
  } else {
    (result.success = false),
      result.messages.push(
        "you dont have an account but you are welcome register"
      );
  }
  return res.send(result);
};

const index = async (req, res, next) => {
  const result = {
    success: true,
    data: null,
    messages: [],
  };
  const companies = await models.Company.findAll({
    include: [models.Province, models.City, models.Category],
  });
  result.data = companiesTransformer(companies);
  return res.send(result);
};

const update = async (req, res, next) => {
  const result = {
    success: false,
    data: null,
    messages: [],
  };
  const {
    name = "",
    email = "",
    password = "",
    cityId = null,
    categoryId = null,
    provinceId = null,
  } = req.body;
  const province = await getInstanceById(provinceId, "Province");
  const city = await getInstanceById(cityId, "City");
  const category = await getInstanceById(categoryId, "Category");
  const item = await getInstanceById(req.params.id, "Company");
  if (!province.success) {
    item.status = 422;
    result.messages.push("Please enter a valid province id");
  } else if (!city.success) {
    item.status = 422;
    result.messages.push("Please enter a valid city id");
  } else if (!category.success) {
    item.status = 422;
    result.messages.push("Please enter a valid category id");
  } else {
    if (item.success) {
      if (!validateName(name)) {
        item.status = 422;
        result.messages.push("Please enter a valid company name");
      } else {
        result.success = true;
        await item.instance.update({
          name,
          email,
          password: hashPassword(password),
          categoryId,
          provinceId,
          cityId,
        });
        result.data = companyTransformer(item.instance);
        result.messages.push("Company updated successfully");
      }
    } else {
      result.messages = [...item.messages];
    }
  }
  res.status(item.status);
  return res.send(result);
};
const destroy = async (req, res, next) => {
  const result = {
    success: false,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Company");
  if (item.success) {
    result.success = true;
    await item.instance.destroy();
    result.messages.push("Company deleted successfully");
  } else {
    result.messages = [...item.messages];
  }
  res.status(item.status);
  return res.send(result);
};
const show = async (req, res, next) => {
  const result = {
    success: false,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Company");
  if (item.success) {
    result.success = true;
    result.data = companyTransformer(item.instance);
    result.data.Province = await item.instance.getProvince({ raw: true });
    result.data.City = await item.instance.getCity({ raw: true });
    result.data.Category = await item.instance.getCategory({ raw: true });

  }
  result.messages = [...item.messages];
  res.status(item.status);
  return res.send(result);
};

module.exports = {
  store,
  login,
  index,
  update,
  destroy,
  show
};
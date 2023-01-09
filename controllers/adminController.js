const models = require("../models");
const { getInstanceById } = require("../services/modelService");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { getToken } = require("../services/tokenService");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../services/validationService");
const { adminTransformer } = require("../transformers/admin");

const store = async (req, res, next) => {
  const result = {
    success: true,
    data: null,
    messages: [],
  };
  const { name = "", email = "", password = "", phone = null } = req.body;
  // Store in database
  const [admin, created] = await models.Admin.findOrCreate({
    where: {
      email,
    },
    defaults: {
      name,
      password: hashPassword(password),
      phone,
    },
  });
  if (created) {
    result.messages.push("Admin created successfully");
  } else {
    result.success = false;
    result.messages.push("You are already registered");
  }
  // Send response
  return res.send(result);
};

const login = async (req, res, next) => {
  const result = {
    success: true,
    data: null,
    messages: [],
    // token: null
  };
  const { email = "", password = "" } = req.body;
  if (!validateEmail(email)) {
    result.success = false;
    result.messages.push("Please enter a valid email");
  }
  if (!validatePassword(password)) {
    result.success = false;
    result.messages.push("Please enter a valid password");
  }
  if (!result.success) {
    res.send(result);
    return;
  }
  // Validation passed - get the admin
  const admin = await models.Admin.findOne({
    where: {
      email,
    },
  });
  if (admin) {
    if (verifyPassword(password, admin.password)) {
      result.data = adminTransformer(admin);
      result.messages.push("Logged in successfully");
      result.token = getToken({
        id: admin.id,
        type: 'admin'
      })
    } else {
      result.success = false;
      result.messages.push("Invalid password!");
    }
  } else {
    result.success = false;
    result.messages.push(
      "You do not have an account but you are welcome to register"
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
  const admins = await models.Admin.findAll();
  result.data = adminTransformer( ...admins);
  return res.send(result);
};
const update = async (req, res, next) => {
  const result = {
    success: false,
    data: null,
    messages: [],
  };
  const { name = "", email = "", password = "", phone = "" } = req.body;
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    if (!validateName(name)) {
      result.messages.push("Please enter a valid city name");
    } else {
      result.success = true;
      await item.instance.update({
        name,
        email,
        password: hashPassword(password),
        phone,
      });
      result.data = adminTransformer(item.instance);
      result.messages.push("Admin updated successfully");
    }
  } else {
    result.messages = [...item.messages];
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
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    result.success = true;
    await item.instance.destroy();
    result.messages.push("Admin deleted successfully");
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
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    result.success = true;
    result.data = item.instance.dataValues;
  }
  result.messages = [...item.messages];
  res.status(item.status);
  return res.send(result)
};
module.exports = {
  store,
  login,
  index,
  update,
  destroy,
  show
};
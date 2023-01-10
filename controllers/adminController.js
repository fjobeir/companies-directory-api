const models = require("../models");
const {
  adminTransformer,
  adminsTransformer,
} = require("../transformers/admin");
const { getInstanceById } = require("../services/modelService");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { getToken, verifyToken } = require("../services/tokenService");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name, email, password, phone = null } = req.body;
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
    httpResponse.messages.push("Admin created successfully");
  } else {
    res.status(409);
    httpResponse.success = false;
    httpResponse.messages.push("You are already registered");
  }
  return res.send(httpResponse);
};

const login = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { email = "", password = "" } = req.body;
  const admin = await models.Admin.findOne({ where: { email } });
  if (admin) {
    if (verifyPassword(password, admin.password)) {
      httpResponse.data = adminTransformer(admin);
      httpResponse.messages.push("Loggen in successfully");
      httpResponse.token = getToken({
        id: admin.id,
        type: "admin",
      });
    } else {
      httpResponse.success = false;
      httpResponse.messages.push("Invalid password!");
      res.status(401);
    }
  } else {
    httpResponse.success = false;
    httpResponse.messages.push("Account not found you should register first!");
    res.status(401);
  }
  return res.send(httpResponse);
};

const index = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const admins = await models.Admin.findAll();
  httpResponse.data = adminsTransformer(admins);
  return res.send(httpResponse);
};

const update = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name, email, password, phone = "" } = req.body;
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    await item.instance.update({
      name,
      email,
      password: hashPassword(password),
      phone,
    });
    httpResponse.data = adminTransformer(item.instance);
    httpResponse.messages.push("Admin updated successfully");
  } else {
    httpResponse.messages = [...item.messages];
    res.status(item.status);
  }
  return res.send(httpResponse);
};

const destroy = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    await item.instance.destroy();
    httpResponse.messages.push("Admin deleted successfully");
  } else {
    res.status(item.status);
    httpResponse.success = false;
    httpResponse.messages = [...item.messages];
  }
  return res.send(httpResponse);
};
const show = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Admin");
  if (item.success) {
    httpResponse.data = item.instance.dataValues;
  }
  httpResponse.success = false;
  httpResponse.messages = [...item.messages];
  res.status(item.status);
  return res.send(httpResponse);
};

module.exports = {
  store,
  login,
  index,
  update,
  destroy,
  show,
};

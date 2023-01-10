const models = require("../models");
const { getInstanceById } = require("../services/modelService");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { getToken, verifyToken } = require("../services/tokenService");
const { userTransformer, usersTransformer } = require("../transformers/user");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const [user, created] = await models.User.findOrCreate({
    where: {
      email: req.body.email,
    },
    defaults: {
      name: req.body.name,
      password: hashPassword(req.body.password),
      avatar: req?.file?.filename,
      bio: req.body.bio,
    },
  });
  if (created) {
    httpResponse.messages.push("User created successfully");
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
  const user = await models.User.findOne({ where: { email } });
  if (user) {
    if (verifyPassword(password, user.password)) {
      httpResponse.data = userTransformer(user);
      httpResponse.messages.push("Loggen in successfully");
      httpResponse.token = getToken({
        id: user.id,
        type: "user",
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
  const users = await models.User.findAll();
  httpResponse.data = usersTransformer(users);
  return res.send(httpResponse);
};

const update = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "User");
  if (item.success) {
    await item.instance.update({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password),
      avatar: req?.file?.filename,
      bio: req.body.bio,
    });
    httpResponse.data = userTransformer(item.instance);
    httpResponse.messages.push("User updated successfully");
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
  const item = await getInstanceById(req.params.id, "User");
  if (item.success) {
    await item.instance.destroy();
    httpResponse.messages.push("User deleted successfully");
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
  const item = await getInstanceById(req.params.id, "User");
  if (item.success) {
    httpResponse.data = userTransformer( item.instance.dataValues);
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

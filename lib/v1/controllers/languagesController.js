const models = require("../models");
const { getInstanceById } = require("../services/modelService");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name = "", code = "", direction = "" } = req.body;
  const language = await models.Language.create({
    name,
    code,
    direction,
  });
  if (language) {
    httpResponse.data = language;
    httpResponse.messages.push("a new language added successfully");
  } else {
    httpResponse.success = false;
    httpResponse.messages.push("Please try again later");
  }
  return res.send(httpResponse);
};

const index = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const languages = await models.Language.findAll();
  httpResponse.data = languages;
  return res.send(httpResponse);
};

const show = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Language");
  if (item.success) {
    httpResponse.success = true;
    httpResponse.data = item.instance.dataValues;
  }
  httpResponse.messages = [...item.messages];
  res.status(item.status);
  return res.send(httpResponse);
};

const update = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name = "", code = "", direction = "" } = req.body;
  const item = await getInstanceById(req.params.id, "Language");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.update({
      name,
      code,
      direction,
    });
    httpResponse.data = item.instance;
    httpResponse.messages.push("Language updated successfully");
  } else {
    httpResponse.messages = [...item.messages];
  }
  res.status(item.status);
  return res.send(httpResponse);
};

const destroy = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Language");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.destroy();
    httpResponse.messages.push("Language deleted successfully");
  } else {
    httpResponse.messages = [...item.messages];
  }
  res.status(item.status);
  return res.send(httpResponse);
};

module.exports = {
  store,
  index,
  show,
  update,
  destroy,
};

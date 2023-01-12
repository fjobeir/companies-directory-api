const models = require("../models");
const { getInstanceById } = require("../services/modelService");

const {
  categoryTransformer,
  categoriesTransformer,
} = require("../transformers/categoryTransformer");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const category = await models.Category.create({
    name: req.body.name,
    description: req.body.description,
    icon: req?.file?.filename,
  });
  if (category) {
    httpResponse.data = categoryTransformer(category);
    httpResponse.messages.push("Category created successfully");
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
  const categories = await models.Category.findAll();
  httpResponse.data = categoriesTransformer(categories);
  return res.send(httpResponse);
};
const update = async (req, res, next) => {
  const httpResponse = {
    success: false,
    data: null,
    messages: [],
  };
  const { name = "", description = "", icon = "" } = req.body;
  const item = await getInstanceById(req.params.id, "Category");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.update({
      name,
      description,
      icon: req?.file?.filename,
    });
    httpResponse.data = categoryTransformer(item.instance);
    httpResponse.messages.push("Category updated successfully");
  } else {
    httpResponse.messages = [...item.messages];
  }
  res.status(item.status);
  return res.send(httpResponse);
};
const show = async (req, res, next) => {
  const httpResponse = {
    success: false,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Category");
  if (item.success) {
    httpResponse.success = true;
    httpResponse.data = categoryTransformer(item.instance.dataValues);
  }
  httpResponse.messages = [...item.messages];
  res.status(item.status);
  return res.send(httpResponse);
};

const destroy = async (req, res, next) => {
  const httpResponse = {
    success: false,
    data: null,
    messages: [],
  };  const item = await getInstanceById(req.params.id, "Category");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.destroy();
    httpResponse.messages.push("Category deleted successfully");
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

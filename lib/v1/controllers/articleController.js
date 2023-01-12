const models = require("../models");
const { getInstanceById } = require("../services/modelService");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const {
    companyId = "",
    categoryId = "",
    title = "",
    content = "",
  } = req.body;
  const company = await getInstanceById(req.body.companyId, "Company");
  const category = await getInstanceById(req.body.categoryId, "Category");
  if (!company.success) {
    res.status(422);
    httpResponse.success = false;
    httpResponse.messages.push("Please enter a valid company id");
  }
  if (!category.success) {
    res.status(422);
    httpResponse.success = false;
    httpResponse.messages.push("Please enter a valid category id");
  }
  if (!httpResponse.success) {
    return res.send(httpResponse);
  }
  const article = await models.Article.create({
    companyId,
    categoryId,
    title,
    content,
  });
  if (article) {
    httpResponse.data = article;
    httpResponse.messages.push("a new article Added successfully");
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
  const articles = await models.Article.findAll({
    include: [models.Company, models.Category],
  });
  httpResponse.data = articles;
  return res.send(httpResponse);
};

const show = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "Article");
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
  const {
    companyId = "",
    categoryId = "",
    title = "",
    content = "",
  } = req.body;
  const company = await getInstanceById(req.body.companyId, "Company");
  const category = await getInstanceById(req.body.categoryId, "Category");
  if (!company.success) {
    res.status(422);
    httpResponse.success = false;
    httpResponse.messages.push("Please enter a valid company id");
  }
  if (!category.success) {
    res.status(422);
    httpResponse.success = false;
    httpResponse.messages.push("Please enter a valid category id");
  }
  if (!httpResponse.success) {
    return res.send(httpResponse);
  }
  const item = await getInstanceById(req.params.id, "Article");
  if (req.user.id == item.instance.companyId) {
    if (item.success) {
      httpResponse.success = true;
      await item.instance.update({
        companyId,
        categoryId,
        title,
        content,
      });
      httpResponse.data = item.instance;
      httpResponse.messages.push("Article updated successfully");
    } else {
      httpResponse.messages = [...item.messages];
    }
  } else {
    httpResponse.success = false
    httpResponse.messages.push('You are not allowed to do so')
    res.status(403);
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
  const item = await getInstanceById(req.params.id, "Article");
  if (req.user.type == 'admin' || (item.instance.companyId == req.user.id)) {
    if (item.success) {
      httpResponse.success = true;
      await item.instance.destroy();
      httpResponse.messages.push("Article deleted successfully");
    } else {
      httpResponse.messages = [...item.messages];
    }
    res.status(item.status);
  } else {
    httpResponse.success = false
    httpResponse.messages.push('You are not allowed to do so')
    res.status(403);
  }
  return res.send(httpResponse);
};

module.exports = {
  store,
  index,
  show,
  update,
  destroy
};

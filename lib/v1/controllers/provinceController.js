const models = require("../models");
const { getInstanceById } = require("../services/modelService");
const { validateName } = require("../services/validationService");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name = "" } = req.body;
  const province = await models.Province.create({
    name,
  });
  if (province) {
    httpResponse.data = province;
    httpResponse.messages.push("Province created successfully");
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
  const provinces = await models.Province.findAll({
    include: [models.City],
  });
  httpResponse.data = provinces;
  return res.send(httpResponse);
};

const show = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };

  // const province = await models.Province.findByPk(req.params.id, {
  //   include: [
  //     {
  //       model: models.City,
  //       include: [
  //         models.Company
  //       ]
  //     }
  //   ]
  // }) 

  // httpResponse.data = province

  const item = await getInstanceById(req.params.id, "Province");
  if (item.success) {
    httpResponse.success = true;
    httpResponse.data = item.instance.dataValues;
    httpResponse.data.Cities = await item.instance.getCities({ raw: true });
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
  const { name = "" } = req.body;
  const item = await getInstanceById(req.params.id, "Province");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.update({
      name,
    });
    httpResponse.data = item.instance;
    httpResponse.messages.push("Province updated successfully");
  } else {
    result.messages = [...item.messages];
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
  const item = await getInstanceById(req.params.id, "Province");
  if (httpResponse.success) {
    httpResponse.success = true;
    await item.instance.destroy();
    httpResponse.messages.push("Province deleted successfully");
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

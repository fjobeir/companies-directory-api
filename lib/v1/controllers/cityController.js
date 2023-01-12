const models = require("../models");
const { getInstanceById } = require("../services/modelService");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const { name = "", provinceId = null } = req.body;
  // Validation
  const province = await getInstanceById(provinceId, "Province");
  if (!province.success) {
    httpResponse.success = false;
    httpResponse.messages.push("Please enter a valid province id");
  }
  if (!httpResponse.success) {
    return res.send(httpResponse);
  }
  const city = await models.City.create({
    name,
    provinceId,
  });
  if (city) {
    httpResponse.data = city;
    httpResponse.messages.push("City created successfully");
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
  const cities = await models.City.findAll({
    include: [models.Province],
  });
  httpResponse.data = cities;
  return res.send(httpResponse);
};

const show = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const item = await getInstanceById(req.params.id, "City");
  if (item.success) {
    httpResponse.success = true;
    httpResponse.data = item.instance.dataValues;
    httpResponse.data.Province = await item.instance.getProvince({ raw: true });
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
  const { name = "", provinceId = null } = req.body;
  const province = await getInstanceById(provinceId, "Province");
  const item = await getInstanceById(req.params.id, "City");
  if (!province.success) {
    httpResponse.messages.push("Please enter a valid province id");
  } else {
    if (item.success) {
      httpResponse.success = true;
      await item.instance.update({
        name,
        provinceId,
      });
      httpResponse.data = item.instance;
      httpResponse.messages.push("City updated successfully");
    } else {
      httpResponse.messages = [...item.messages];
    }
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
  const item = await getInstanceById(req.params.id, "City");
  if (item.success) {
    httpResponse.success = true;
    await item.instance.destroy();
    httpResponse.messages.push("City deleted successfully");
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

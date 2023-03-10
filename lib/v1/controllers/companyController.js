const models = require("../models");
const { getInstanceById } = require("../services/modelService");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { getToken, verifyToken } = require("../services/tokenService");
const {
  companyTransformer,
  companiesTransformer,
} = require("../transformers/company");
const sequelize = require('sequelize');
const { usersTransformer } = require("../transformers/user");

const store = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const {latitude = 0.0, longitude = 0.0} = req.body
  const province = await getInstanceById(req.body.provinceId, "Province");
  const city = await getInstanceById(req.body.cityId, "City");
  const category = await getInstanceById(req.body.categoryId, "Category");
  if (!province.success) {
    httpResponse.success = false
    res.status(422);
    httpResponse.messages.push("Please enter a valid province id");
  }
  if (!city.success) {
    httpResponse.success = false
    res.status(422);
    httpResponse.messages.push("Please enter a valid city id");
  }
  if (!category.success) {
    httpResponse.success = false
    res.status(422);
    httpResponse.messages.push("Please enter a valid category id");
  }
  if (!httpResponse.success) {
    return res.send(httpResponse)
  }
  const [company, created] = await models.Company.findOrCreate({
    where: {
      email: req.body.email,
    },
    defaults: {
      name: req.body.name,
      password: hashPassword(req.body.password),
      logo: req?.files?.logo[0]?.filename,
      banner: req?.files?.banner[0]?.filename,
      categoryId: req.body.categoryId,
      provinceId: req.body.provinceId,
      cityId: req.body.cityId,
      address: req.body.address,
      longitude,
      latitude
    },
  });
  if (created) {
    httpResponse.data = companyTransformer(company)
    httpResponse.messages.push("Company created successfully");
  } else {
    res.status(200);
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
  const company = await models.Company.findOne({ where: { email } });
  if (company) {
    if (verifyPassword(password, company.password)) {
      httpResponse.data = companyTransformer(company);
      httpResponse.messages.push("Loggen in successfully");
      httpResponse.token = getToken({
        id: company.id,
        type: "company",
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
  const {lat = null, lng = null} = req.query
  const attributes = ['id', 'name', 'logo', 'banner', 'address', 'email', 'views', 'longitude', 'latitude']
    if (lng && lat) {
        attributes.push(
            [sequelize.literal("6371 * acos(cos(radians("+lat+")) * cos(radians(latitude)) * cos(radians("+lng+") - radians(longitude)) + sin(radians("+lat+")) * sin(radians(latitude)))"), 'distance']
        )
    }
  const company = await models.Company.findAll({
    include: [
      {
        model: models.User,
        as: 'Favorite'
      }
    ],
    attributes,
    order: (lat && lng) ? sequelize.col('distance') : ['name'],
    limit: 12
  });
  httpResponse.data = companiesTransformer(company);
  return res.send(httpResponse);
};

const update = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const province = await getInstanceById(req.body.provinceId, "Province");
  const city = await getInstanceById(req.body.cityId, "City");
  const category = await getInstanceById(req.body.categoryId, "Category");
  if (!province.success) {
    res.status(422);
    httpResponse.messages.push("Please enter a valid province id");
  }
  if (!city.success) {
    res.status(422);
    httpResponse.messages.push("Please enter a valid city id");
  }
  if (!category.success) {
    res.status(422);
    httpResponse.messages.push("Please enter a valid category id");
  }
  const item = await getInstanceById(req.params.id, "Company");
  if (item.success) {
    await item.instance.update({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password),
      logo: req?.files?.logo[0]?.filename,
      banner: req?.files?.banner[0]?.filename,
      categoryId: req.body.categoryId,
      provinceId: req.body.provinceId,
      cityId: req.body.cityId,
      address: req.body.address,
    });
    httpResponse.data = companyTransformer(item.instance);
    httpResponse.messages.push("Company updated successfully");
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
  const item = await getInstanceById(req.params.id, "Company");
  if (item.success) {
    await item.instance.destroy();
    httpResponse.messages.push("Company deleted successfully");
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
  const item = await getInstanceById(req.params.id, "Company");
  if (item.success) {
    httpResponse.data = companyTransformer(item.instance).dataValues;
    httpResponse.data.Favorites = usersTransformer(await item.instance.getFavorite())
    httpResponse.data.Contacts = await item.instance.getContacts()
    httpResponse.data.Views = await item.instance.countView()
  }
  httpResponse.success = false;
  httpResponse.messages = [...item.messages];
  res.status(item.status);
  return res.send(httpResponse);
};


const me = async (req, res, next) => {
  const httpResponse = {
    success: true,
    data: null,
    messages: [],
  };
  const company = await models.Company.findByPk(req.user.id, {
    include: [
      models.Article,
      models.Ad
    ]
  })
  if (company) {
    httpResponse.data = companyTransformer(company);
  }
  return res.send(httpResponse);
};
module.exports = {
  store,
  login,
  index,
  update,
  destroy,
  show,
  me
};

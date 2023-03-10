const { adsTransformer } = require("./adTransformer");
const { usersTransformer } = require("./user");

const companyTransformer = (company) => {
  if (company?.dataValues?.password) {
    delete company.dataValues.password;
  }
  if (company?.logo) {
    company.logo = process.env.serverUrl + '/uploads/' + company.logo;
  }
  if (company?.banner) {
    company.banner = process.env.serverUrl + '/uploads/' + company.banner;
  }
  if (company?.Ads) {
    company.Ads = adsTransformer(company.Ads)
  }
  if (company.latitude) {
    company.latitude = parseFloat(company.latitude)
  }
  if (company.longitude) {
    company.longitude = parseFloat(company.longitude)
  }
  if (company.Favorite) {
    company.Favorite = usersTransformer(company.Favorite)
  }
  return company;
};
const companiesTransformer = (companies) => {
  return companies.map((companey) => companyTransformer(companey));
};
module.exports = {
  companyTransformer,
  companiesTransformer,
};

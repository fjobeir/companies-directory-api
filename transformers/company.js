const companyTransformer = (company) => {
  if (company?.dataValues?.password) {
    delete company.dataValues.password;
  }
  if (company?.logo) {
    company.logo = process.env.serverUrl + company.logo;
  }
  if (company?.banner) {
    company.banner = process.env.serverUrl + company.banner;
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

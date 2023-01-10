const companyTransformer = (company) => {
  if (company?.dataValues?.password) {
    delete company.dataValues.password;
  }
  if (company?.logo) {
    company.logo = process.env.server_url + company.logo;
  }
  if (company?.banner) {
    company.banner = process.env.server_url + company.banner;
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

const categoryTransformer = (category) => {
  if (category?.icon) {
    category.icon = process.env.server_url + category.icon;
  }
  return category;
};

const categoriesTransformer = (categories) => {
  return categories.map((category) => categoryTransformer(category));
};

module.exports = {
  categoryTransformer,
  categoriesTransformer,
};

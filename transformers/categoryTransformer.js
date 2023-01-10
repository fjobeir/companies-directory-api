const categoryTransformer = (category) => {
  if (category?.icon) {
    category.icon = process.env.serverUrl + category.icon;
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

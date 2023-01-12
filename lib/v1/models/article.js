'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.Company, { 
        foreignKey: "companyId"
      })
      Article.belongsTo(models.Category, { 
        foreignKey: "categoryId"
      })

    }
  }
  Article.init({
    companyId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
    paranoid: true
  });
  return Article;
};
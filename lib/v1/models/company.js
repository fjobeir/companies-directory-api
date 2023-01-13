"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Company.belongsTo(models.Province, {
        foreignKey: "provinceId",
      });
      Company.belongsTo(models.City, {
        foreignKey: "cityId",
      });
      Company.hasMany(models.Article, { 
        foreignKey: 'companyId'
      })
      Company.hasMany(models.Review, { 
        foreignKey: 'companyId'
      })
      Company.hasMany(models.Ad, { 
        foreignKey: 'companyId'
      })
     
      Company.belongsToMany(models.User, {
        through: 'Favorites',
        foreignKey: 'companyId',
        as: 'Favorite'
      })
      Company.belongsToMany(models.User, {
        through: {
          unique: false,
          model: 'Views'
        },
        foreignKey: 'companyId',
        as: 'View'
      })
      Company.hasMany(models.Contact, {
        foreignKey: 'contactableId',
        constraints: false,
        scope: {
          contactableType: 'company'
        }
      });
    }
  }
  Company.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      provinceId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      logo: DataTypes.STRING,
      banner: DataTypes.STRING,
      // views: DataTypes.INTEGER,
      latitude: DataTypes.DECIMAL,
      longitude: DataTypes.DECIMAL,
      establishmentDate: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Company",
      paranoid: true,
    }
  );
  return Company;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // reverse of hasMany
      City.belongsTo(models.Province, {
        foreignKey: "provinceId",
      });
      City.hasMany(models.Company, {
        foreignKey: "cityId",
      });
    }
  }
  City.init(
    {
      provinceId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "City",
      paranoid: true,
    }
  );
  return City;
};

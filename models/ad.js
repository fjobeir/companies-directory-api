'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ad.belongsTo(models.Company, { 
        foreignKey: 'companyId'
      })
    }
  }
  Ad.init({
    companyId: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    target: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ad',
    paranoid: true
  });
  return Ad;
};
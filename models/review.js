'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, { 
        foreignKey: "userId"
      })
      Review.belongsTo(models.Company, { 
        foreignKey: "companyId"
      })
    }
  }
  Review.init({
    userId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    rate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
    paranoid: true
  });
  return Review;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Review, { 
        foreignKey:'userId',
      })
      User.belongsToMany(models.Company, {
        through: 'Favorites',
        foreignKey: 'userId',
        as: 'Favorite'
      })
      User.belongsToMany(models.Company, {
        through: 'Views',
        foreignKey: 'userId',
        as: 'View'
      })
      User.hasMany(models.Contact, {
        foreignKey: 'contactableId',
        constraints: false,
        scope: {
          contactableType: 'user'
        }
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};
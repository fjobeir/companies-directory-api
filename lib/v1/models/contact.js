'use strict';

const uppercaseFirst = str => `${str[0].toUpperCase()}${str.substr(1)}`;


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    getContactable(options) {
      if (!this.contactableType) return Promise.resolve(null);
      const mixinMethodName = `get${uppercaseFirst(this.contactableType)}`;
      return this[mixinMethodName](options);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contact.belongsTo(models.Company, {
        foreignKey: 'contactableId',
        constraints: false
      });
      Contact.belongsTo(models.User, {
        foreignKey: 'contactableId',
        constraints: false
      });

    }
  }
  Contact.init({
    contactableId: DataTypes.INTEGER,
    contactableType: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contact',
  });
  Contact.addHook("afterFind", findResult => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      if (instance.contactableType === "company" && instance.company !== undefined) {
        instance.contactable = instance.company;
      } else if (instance.contactableType === "user" && instance.user !== undefined) {
        instance.contactable = instance.user;
      }
      // To prevent mistakes:
      delete instance.company;
      delete instance.dataValues.company;
      delete instance.user;
      delete instance.dataValues.user;
    }
  });
  return Contact;
};
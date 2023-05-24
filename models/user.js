"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addUser({ name, dateOfBirth, email, phoneNumber }) {
      return this.create({
        name,
        dateOfBirth,
        email,
        phoneNumber,
      });
    }
    static getUsers() {
      return this.findAll();
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      dateOfBirth: DataTypes.DATEONLY,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

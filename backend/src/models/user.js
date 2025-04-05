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
      // Um usuário (cliente) pode ter muitos pedidos de descarte
      User.hasMany(models.DiscardRequest, {
        foreignKey: 'userId',
        as: 'requests'
      });

      // Um usuário (empresa) pode aceitar muitos pedidos
      User.hasMany(models.DiscardRequest, {
        foreignKey: 'companyId',
        as: 'acceptedRequests'
      });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    cep: DataTypes.STRING,
    street: DataTypes.STRING,
    number: DataTypes.STRING,
    neighborhood: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

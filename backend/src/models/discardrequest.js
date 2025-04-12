'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscardRequest extends Model {
    static associate(models) {
      DiscardRequest.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      DiscardRequest.belongsTo(models.User, {
        foreignKey: 'companyId',
        as: 'company',
      });
    }
  }

  DiscardRequest.init({
    type: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pendente',
    },
    userId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DiscardRequest',
  });

  return DiscardRequest;
};

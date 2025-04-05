'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscardRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cada pedido pertence a um cliente
      DiscardRequest.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'client'
      });

      // E pode ser aceito por uma empresa
      DiscardRequest.belongsTo(models.User, {
        foreignKey: 'companyId',
        as: 'company'
      });
    }
  }

  DiscardRequest.init({
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    day: DataTypes.STRING,
    time: DataTypes.STRING,
    status: DataTypes.STRING,
    companyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DiscardRequest',
  });

  return DiscardRequest;
};

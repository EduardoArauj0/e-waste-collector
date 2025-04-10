'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Users', 'neighborhood', Sequelize.STRING),
      queryInterface.addColumn('Users', 'city', Sequelize.STRING),
      queryInterface.addColumn('Users', 'state', Sequelize.STRING)
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Users', 'neighborhood'),
      queryInterface.removeColumn('Users', 'city'),
      queryInterface.removeColumn('Users', 'state')
    ]);
  }
};


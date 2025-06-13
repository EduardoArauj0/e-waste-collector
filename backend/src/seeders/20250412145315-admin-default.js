'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();

const senhaCriptografada = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [
      {
        email: process.env.ADMIN_EMAIL,
        password: senhaCriptografada,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Admins', null, {});
}

'use strict';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const senhaCriptografada = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Admins', [
    {
      email: process.env.ADMIN_EMAIL,
      password: senhaCriptografada,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Admins', null, {});
}

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Partida', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATE
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      equipoA: {
        type: Sequelize.STRING
      },
      equipoB: {
        type: Sequelize.STRING
      },
      factorA: {
        type: Sequelize.INTEGER
      },
      factorB: {
        type: Sequelize.INTEGER
      },
      factorE: {
        type: Sequelize.INTEGER
      },
      resultado: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => { 
    await queryInterface.dropTable('Partida');
  }
};
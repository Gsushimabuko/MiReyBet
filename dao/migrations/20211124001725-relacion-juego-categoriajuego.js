'use strict';

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
 
     await queryInterface.addColumn('Juego','categoriaJuegoId',{
        type: Sequelize.INTEGER,
        allowNull:true
     })

     await queryInterface.addConstraint('Juego',{
      fields : ['categoriaJuegoId'],
      type : 'FOREIGN KEY',
      name : 'FK_JUEGO_CATEGORIAJUEGO',
      references :{ 
        table : 'CategoriaJuego',
        field : 'id'
      }
   })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Juego','FK_JUEGO_CATEGORIAJUEGO')
    await queryInterface.removeColumn('Juego','categoriaJuegoId')

  }
};

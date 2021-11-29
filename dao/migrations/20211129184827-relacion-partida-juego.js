'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partida','juego',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('Partida',{
    fields : ['juego'],
    type : 'FOREIGN KEY',
    name : 'FK_PARTIDA_NOMBREJUEGO',
    references :{ 
      table : 'Juego',
      field : 'id'
    }
 })

},

down: async (queryInterface, Sequelize) => {
  await queryInterface.removeConstraint('Partida','FK_PARTIDA_NOMBREJUEGO')
  await queryInterface.removeColumn('Partida','juego')

}
};

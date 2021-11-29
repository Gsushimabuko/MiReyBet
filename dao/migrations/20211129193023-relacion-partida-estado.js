'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partida','estado',{
      type: Sequelize.INTEGER,
      allowNull:true
   })

   await queryInterface.addConstraint('Partida',{
    fields : ['estado'],
    type : 'FOREIGN KEY',
    name : 'FK_PARTIDA_ESTADO',
    references :{ 
      table : 'EstadoPartida',
      field : 'id'
    }
 })

},

down: async (queryInterface, Sequelize) => {
  await queryInterface.removeConstraint('Partida','FK_PARTIDA_ESTADO')
  await queryInterface.removeColumn('Partida','estado')

}
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Juego', [
      {nombre: 'Juego1', createdAt: new Date(), updatedAt: new Date(),categoriaJuegoId: '1'},
      {nombre: 'Juego2', createdAt: new Date(), updatedAt: new Date(),categoriaJuegoId: '3'}
    ]);

    await queryInterface.bulkInsert('EstadoPartida', [
      {nombre: 'Pendiente', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Iniciado', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Finalizado', createdAt: new Date(), updatedAt: new Date()}
    ]);

    await queryInterface.bulkInsert('CategoriaJuego', [
      {nombre: 'Cate', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Cate2', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Cate3', createdAt: new Date(), updatedAt: new Date()}
    ]);

    await queryInterface.bulkInsert('Banner', [
      {nombre: 'Banner1', urlBanner: '/imagenes/banners/1638193227730.png', createdAt: new Date(), updatedAt: new Date()},
      {nombre: 'Banner2', rlBanner: '/imagenes/banners/1638193274280.webp', createdAt: new Date(), updatedAt: new Date()}
    ]);

    await queryInterface.bulkInsert('Cuenta', [
      {correo: 'admin', pass: 'admin', estado: '2',createdAt: new Date(), updatedAt: new Date()},
      {correo: 'pruebav', pass: 'pruebav', estado: '2',createdAt: new Date(), updatedAt: new Date()},
      {correo: 'pruebas', pass: 'pruebas', estado: '1',createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoriaJuego extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CategoriaJuego.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CategoriaJuego',
    freezeTableName : true
  });
  return CategoriaJuego;
};
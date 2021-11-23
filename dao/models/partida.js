'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Partida.init({
    fecha: DataTypes.DATE,
    duracion: DataTypes.INTEGER,
    equipoA: DataTypes.STRING,
    equipoB: DataTypes.STRING,
    factorA: DataTypes.INTEGER,
    factorB: DataTypes.INTEGER,
    factorE: DataTypes.INTEGER,
    resultado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Partida',
    freezeTableName : true
  });
  return Partida;
};
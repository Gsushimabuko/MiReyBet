'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apuesta3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Apuesta3.init({
    codigoPartida: DataTypes.STRING,
    equipo: DataTypes.STRING,
    monto: DataTypes.INTEGER,
    factor: DataTypes.FLOAT,
    iduUsuario: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Apuesta3',
    freezeTableName: true
  });
  return Apuesta3;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EstadoPartida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  EstadoPartida.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EstadoPartida',
    freezeTableName : true
  });
  return EstadoPartida;
};
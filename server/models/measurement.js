const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Measurement extends Sequelize.Model {}
  Measurement.init({
    measurement_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Make sure this is the correct table name
        key: 'user_id'
      }
    },
    date: DataTypes.DATE,
    weight: DataTypes.DECIMAL,
    body_fat_percentage: DataTypes.DECIMAL,
    chest: DataTypes.DECIMAL,
    waist: DataTypes.DECIMAL,
    thighr: DataTypes.DECIMAL,
    thighl: DataTypes.DECIMAL,
    armr: DataTypes.DECIMAL,
    arml: DataTypes.DECIMAL,
    photo1: DataTypes.BLOB,
    photo2: DataTypes.BLOB,
    photo3: DataTypes.BLOB,
    photo4: DataTypes.BLOB,
  }, {
    sequelize,
    tableName: 'measurements',
    timestamps: false,
  });

  Measurement.associate = function(models) {
    Measurement.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Measurement;
};

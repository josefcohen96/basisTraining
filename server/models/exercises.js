const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Exercise extends Sequelize.Model {}
  Exercise.init({
    exercise_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exercise_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'exercises',
    timestamps: false,
  });

  return Exercise;
};

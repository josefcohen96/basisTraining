const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Workout extends Sequelize.Model {}
  Workout.init({
    workout_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    workout_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workout_description: DataTypes.STRING,
    scheduled_date: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'workouts',
    timestamps: false,
  });

  Workout.associate = function(models) {
    Workout.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Workout;
};

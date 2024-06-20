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
        model: 'users',  // Ensure this is the correct table name
        key: 'user_id'
      }
    },
    workout_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workout_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
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

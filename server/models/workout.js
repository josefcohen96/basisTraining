const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Workout = sequelize.define('Workout', {
    workout_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // refers to table name
        key: 'user_id',
      },
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
    tableName: 'workouts',
    timestamps: true,
  });

  Workout.associate = (models) => {
    Workout.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Workout;
};

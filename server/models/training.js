const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Training = sequelize.define('Training', {
    training_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'workouts',
        key: 'workout_id',
      },
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exercises',
        key: 'exercise_id',
      },
    },
    trainer_exp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sets_to_do: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reps_to_do: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    goal_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    manipulation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sets_done: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reps_done: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_set_weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'training',
    timestamps: false,
  });

  Training.associate = (models) => {
    Training.belongsTo(models.Exercise, { foreignKey: 'exercise_id' });
  };

  return Training;
};

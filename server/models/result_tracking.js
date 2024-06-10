const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ResultTracking extends Sequelize.Model {}
  ResultTracking.init({
    result_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tasks',  // Make sure this is the correct table name
        key: 'task_id'
      }
    },
    steps_to_do: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    avg_steps: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    eating_day_free_txt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    result_dt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'result_tracking',
    timestamps: false,
  });

  ResultTracking.associate = function(models) {
    ResultTracking.belongsTo(models.Task, { foreignKey: 'task_id' });
  };

  return ResultTracking;
};

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class NutritionPlan extends Sequelize.Model {}
  NutritionPlan.init({
    plan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    plan_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pdf_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'nutrition_plan',
    timestamps: false,
  });

  NutritionPlan.associate = function(models) {
  };

  return NutritionPlan;
};

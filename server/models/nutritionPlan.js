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
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    plan_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plan_description: DataTypes.STRING,
    pdf_link: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'nutrition_plan',
    timestamps: false,
  });

  NutritionPlan.associate = function(models) {
    NutritionPlan.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return NutritionPlan;
};

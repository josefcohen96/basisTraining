const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserDetail extends Sequelize.Model {}
  UserDetail.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    phone: DataTypes.STRING,
    age: DataTypes.INTEGER,
    height: DataTypes.DECIMAL,
    weight: DataTypes.DECIMAL,
    training_years: DataTypes.INTEGER,
    training_frequency: DataTypes.STRING,
    preferred_training_location: DataTypes.STRING,
    home_equipment: DataTypes.STRING,
    desired_equipment: DataTypes.STRING,
    strength_training_description: DataTypes.STRING,
    preferred_focus_areas: DataTypes.STRING,
    favorite_cardio: DataTypes.STRING,
    current_cardio_routine: DataTypes.STRING,
    injuries: DataTypes.STRING,
    highest_weight: DataTypes.DECIMAL,
    favorite_foods: DataTypes.STRING,
    disliked_foods: DataTypes.STRING,
    food_tracking_method: DataTypes.STRING,
    past_diets: DataTypes.STRING,
    daily_nutrition: DataTypes.STRING,
    weekend_nutrition: DataTypes.STRING,
    favorite_recipes: DataTypes.STRING,
    alcohol_consumption: DataTypes.STRING,
    medications: DataTypes.STRING,
    sleep_hours: DataTypes.DECIMAL,
    current_job: DataTypes.STRING,
    activity_level: DataTypes.STRING,
    sports_participation: DataTypes.STRING,
    mirror_reflection: DataTypes.STRING,
    long_term_goals: DataTypes.STRING,
    motivation_level: DataTypes.STRING,
    commitment_declaration: DataTypes.STRING,
    additional_notes: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'user_details',
    timestamps: false,
  });

  UserDetail.associate = function(models) {
    UserDetail.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return UserDetail;
};

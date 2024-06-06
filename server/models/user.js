const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
  });

  User.associate = function(models) {
    User.hasOne(models.UserDetail, { foreignKey: 'user_id' });
    User.hasMany(models.Task, { foreignKey: 'user_id' });
    User.hasMany(models.Workout, { foreignKey: 'user_id' });
    User.hasMany(models.Measurement, { foreignKey: 'user_id' });
    User.hasMany(models.NutritionPlan, { foreignKey: 'user_id' });
  };

  return User;
};

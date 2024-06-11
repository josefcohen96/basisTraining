const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasOne(models.UserDetail, { foreignKey: 'user_id' });
    User.hasMany(models.Task, { foreignKey: 'user_id' });
    User.hasMany(models.Workout, { foreignKey: 'user_id' });
    User.hasMany(models.Measurement, { foreignKey: 'user_id' });
    User.hasMany(models.NutritionPlan, { foreignKey: 'user_id' });
    User.hasMany(models.Course, { foreignKey: 'user_id' });
  };

  return User;
};

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ApprovedEmail extends Sequelize.Model {}
  ApprovedEmail.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'approved_emails',
    timestamps: true,
  });

  return ApprovedEmail;
};

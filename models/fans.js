const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fans', {
    fans_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fan_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    followed_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    classify_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'class',
        key: 'class_id'
      }
    }
  }, {
    sequelize,
    tableName: 'fans',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fans_id" },
        ]
      },
      {
        name: "fan_id",
        using: "BTREE",
        fields: [
          { name: "fan_id" },
        ]
      },
      {
        name: "followed_id",
        using: "BTREE",
        fields: [
          { name: "followed_id" },
        ]
      },
      {
        name: "classify_id",
        using: "BTREE",
        fields: [
          { name: "classify_id" },
        ]
      },
    ]
  });
};

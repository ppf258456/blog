const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('follow', {
    follow_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    follower_id: {
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
    },
    is_mutual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'follow',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "follow_id" },
        ]
      },
      {
        name: "follower_id",
        using: "BTREE",
        fields: [
          { name: "follower_id" },
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

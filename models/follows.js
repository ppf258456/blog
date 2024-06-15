const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('follows', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
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
    followee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    is_mutual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'follows',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "follower_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "follower_id" },
          { name: "followee_id" },
        ]
      },
      {
        name: "followee_id",
        using: "BTREE",
        fields: [
          { name: "followee_id" },
        ]
      },
    ]
  });
};

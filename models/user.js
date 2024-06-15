const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "username"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    member_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "member_number"
    },
    avatar: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fans_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    follow_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    likes_count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    background_image: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    register_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_login_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    account_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_level: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coin_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "member_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "member_number" },
        ]
      },
    ]
  });
};

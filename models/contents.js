const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contents', {
    content_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    likes: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    coins: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    favorites: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    shares: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    author_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'contents',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
      {
        name: "author_id",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
};

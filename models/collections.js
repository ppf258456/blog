const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collections', {
    collection_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    content_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'contents',
        key: 'content_id'
      }
    },
    classfy_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'class',
        key: 'class_id'
      }
    }
  }, {
    sequelize,
    tableName: 'collections',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "collection_id" },
        ]
      },
      {
        name: "unique_collection",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "content_type" },
          { name: "content_id" },
        ]
      },
      {
        name: "idx_collections_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "idx_collections_classfy_id",
        using: "BTREE",
        fields: [
          { name: "classfy_id" },
        ]
      },
      {
        name: "fk_collections_content_id",
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
    ]
  });
};

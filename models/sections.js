const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sections', {
    section_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    section_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    section_description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sections',
    timestamps: true,
    paranoid: true, // 启用软删除
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "section_id" },
        ]
      },
    ]
  });
};

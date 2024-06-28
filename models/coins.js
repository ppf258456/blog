const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coins', {
    coins_id: {
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
    coins_number: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    transaction_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaction_info: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'coins',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "coins_id" },
        ]
      },
      {
        name: "idx_coins_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};

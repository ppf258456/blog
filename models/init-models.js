var DataTypes = require("sequelize").DataTypes;

function initModels(sequelize) {
  var rolepermissions = _rolepermissions(sequelize, DataTypes);

  rolepermissions.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(rolepermissions, { as: "rolepermissions", foreignKey: "userId"});

  return {
    rolepermissions,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

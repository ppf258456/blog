var DataTypes = require("sequelize").DataTypes;
var _class_ = require("./class");
var _fans = require("./fans");
var _follow = require("./follow");
var _sessions = require("./sessions");
var _user = require("./user");

function initModels(sequelize) {
  var Class_ = _class_(sequelize, DataTypes);
  var Fans = _fans(sequelize, DataTypes);
  var Follow = _follow(sequelize, DataTypes);
  var Sessions = _sessions(sequelize, DataTypes);
  var User = _user(sequelize, DataTypes);

  Fans.belongsTo(Class_, { as: "classify", foreignKey: "classify_id"});
  Class_.hasMany(Fans, { as: "fans", foreignKey: "classify_id"});
  Follow.belongsTo(Class_, { as: "classify", foreignKey: "classify_id"});
  Class_.hasMany(Follow, { as: "follows", foreignKey: "classify_id"});
  Class_.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(Class_, { as: "classes", foreignKey: "user_id"});
  Fans.belongsTo(User, { as: "fan", foreignKey: "fan_id"});
  User.hasMany(Fans, { as: "fans", foreignKey: "fan_id"});
  Fans.belongsTo(User, { as: "followed", foreignKey: "followed_id"});
  User.hasMany(Fans, { as: "followed_fans", foreignKey: "followed_id"});
  Follow.belongsTo(User, { as: "follower", foreignKey: "follower_id"});
  User.hasMany(Follow, { as: "follows", foreignKey: "follower_id"});
  Follow.belongsTo(User, { as: "followed", foreignKey: "followed_id"});
  User.hasMany(Follow, { as: "followed_follows", foreignKey: "followed_id"});

  return {
    Class_,
    Fans,
    Follow,
    Sessions,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

var DataTypes = require("sequelize").DataTypes;
var _follows = require("./follows");
var _session = require('./sessions')
var _user = require("./user");

function initModels(sequelize) {
  var Follows = _follows(sequelize, DataTypes);
  var Session = _session(sequelize,DataTypes)
  var User = _user(sequelize, DataTypes);

  Follows.belongsTo(User, { as: "follower", foreignKey: "follower_id"});
  User.hasMany(Follows, { as: "follows", foreignKey: "follower_id"});
  Follows.belongsTo(User, { as: "followee", foreignKey: "followee_id"});
  User.hasMany(Follows, { as: "followee_follows", foreignKey: "followee_id"});

  return {
    Follows,
    Session,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

var DataTypes = require("sequelize").DataTypes;
var _transactions = require("./transactions");
var _class_ = require("./class");
var _fans = require("./fans");
var _follow = require("./follow");
var _sessions = require("./sessions");
var _user = require("./user");
var _likes = require("./likes");
var _collections = require("./collections");
var _coins = require("./coins");
var _sections = require("./sections");
var _categories = require("./categories");
var _contents = require("./contents");
var _content_categories = require("./content_categories");

function initModels(sequelize) {

  var content_categories = _content_categories(sequelize, DataTypes);
  var contents = _contents(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var sections = _sections(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var Class_ = _class_(sequelize, DataTypes);
  var Fans = _fans(sequelize, DataTypes);
  var Follow = _follow(sequelize, DataTypes);
  var Sessions = _sessions(sequelize, DataTypes);
  var User = _user(sequelize, DataTypes);
  var likes = _likes(sequelize, DataTypes);
  var collections = _collections(sequelize, DataTypes);
  var coins = _coins(sequelize, DataTypes);


  categories.belongsToMany(contents, { as: 'content_id_contents', through: content_categories, foreignKey: "category_id", otherKey: "content_id" });
  contents.belongsToMany(categories, { as: 'category_id_categories', through: content_categories, foreignKey: "content_id", otherKey: "category_id" });
  content_categories.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(content_categories, { as: "content_categories", foreignKey: "category_id"});
  content_categories.belongsTo(contents, { as: "content", foreignKey: "content_id"});
  contents.hasMany(content_categories, { as: "content_categories", foreignKey: "content_id"});
  contents.belongsTo(User, { as: "author", foreignKey: "author_id"});
  User.hasMany(contents, { as: "contents", foreignKey: "author_id"});
  categories.belongsTo(sections, { as: "section", foreignKey: "section_id"});
  sections.hasMany(categories, { as: "categories", foreignKey: "section_id"});
  transactions.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(transactions, { as: "transactions", foreignKey: "user_id"});
  coins.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(coins, { as: "coins", foreignKey: "user_id"});
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
  likes.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(likes, { as: "likes", foreignKey: "user_id"});
  collections.belongsTo(Class_, { as: "classfy", foreignKey: "classfy_id"});
  Class_.hasMany(collections, { as: "collections", foreignKey: "classfy_id"});
  collections.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(collections, { as: "collections", foreignKey: "user_id"});

  return {
    transactions,
    Class_,
    Fans,
    Follow,
    Sessions,
    User,
    likes,
    collections,
    coins,
    sections,
    categories,
    contents,
    content_categories,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
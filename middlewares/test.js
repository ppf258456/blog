const test = ((req, res, next) => {
  console.log(req.query);
    next();
  });
  module.exports = test;

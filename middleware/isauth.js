module.exports = (req, res, next) => {
  if (!req.session.user) {
    console.log("middleware activated");
    return res.redirect("/login");
  }
  next();
};

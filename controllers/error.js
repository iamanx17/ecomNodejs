exports.error404 = (req, res, next) => {
  res.status(404).render("error.njk");
};
 
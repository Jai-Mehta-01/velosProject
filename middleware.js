module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must Login First!");
    return res.redirect("/login");
  }
  if (req.user.isAdministrator) {
    next();
  } else res.redirect("/");
};

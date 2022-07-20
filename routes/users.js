const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { isLoggedIn } = require("../middleware");

router
  .route("/login")
  .get(users.loginPage)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.Login
  );

router.route("/signup").get(users.signUpPage).post(users.signUp);

router.route("/profile").get(isLoggedIn, users.profile);

router
  .route("/profile/edit")
  .get(isLoggedIn, users.profileEditPage)
  .post(isLoggedIn, users.profileEdit);

router.route("/activeOrders").get(isLoggedIn, users.userActiveOrdersPage);

router.route("/userHistory").get(isLoggedIn, users.userHistoryPage);

router.route("/logout").get(isLoggedIn, users.logOut);

module.exports = router;

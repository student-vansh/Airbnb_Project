const express = require("express");
const route = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../Controllers/User.js");

route
  .route("/signup")
  .get(UserController.renderForm)
  .post(wrapAsync(UserController.SingUpuser));

route
  .route("/login")
  .get(UserController.loginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.login,
  );

route.get("/logout", UserController.logout);
module.exports = route;

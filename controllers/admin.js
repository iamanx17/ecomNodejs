const path = require("path");
const bcrypt = require("bcrypt");

const userModel = require("../models/user");

exports.GetRegister = (req, res, next) => {
  return res.render("register", { isAuthenticated: req.session.isLoggedin });
};

exports.PostRegister = async (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  if (password1 != password2) {
    return res.render("register", {
      message: "Password not matched",
      isAuthenticated: req.session.isLoggedin,
    });
  }
  const userEntity = await userModel.findOne({ email: email });
  console.log(userEntity);
  if (userEntity) {
    return res.render("register", {
      message: "Email id already exists!",
      isAuthenticated: req.session.isLoggedin,
    });
  }

  const user = new userModel({
    firstName: first_name,
    lastName: last_name,
    email: email,
    password: await bcrypt.hash(password1, 10),
  });
  user.save();
  return res.render("register", {
    message: "Account created successfully!!",
    isAuthenticated: req.session.isLoggedin,
  });
};

exports.GetLogin = (req, res, next) => {
  console.log(req.session);
  return res.render("login", { isAuthenticated: req.session.isLoggedin });
};

exports.PostLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userEntity = await userModel.findOne({ email: email });

  if (!userEntity) {
    return res.render("login", {
      message: "User not found!",
      isAuthenticated: req.session.isLoggedin,
    });
  }
  const isValid = bcrypt.compare(password, userEntity.password);
  if (!isValid) {
    return res.render("login", {
      message: "Password not matched",
      isAuthenticated: req.session.isLoggedin,
    });
  }
  req.session.user = userEntity;
  req.session.isLoggedin = true;
  return res.redirect("/");
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Some error occured:", err);
    }
    return res.redirect("/");
  });
};

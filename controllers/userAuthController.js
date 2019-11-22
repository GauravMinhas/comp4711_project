const express = require('express');
const bodyParser = require('body-parser');
const userAuth = require('../models/userAuth');

const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

/* pass the form inputs: (email, name, and password)
   into registration page where registration happens. */
exports.register = (req, res) => {
  const userAuthData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    password: req.body.password,
    email: req.body.email,
  };
  /* Renders registration page. */
  res.render('registration', {
    data: userAuthData,
    registrationCSS: true,
  });
};

/* calls the api functions for registration, insert the data into userauth and userinfo
   we should probably block invalid input in front-end, which is easier to handle */
exports.signup = (req, res) => {
  const userAuthData = {
    password: req.body.password,
    email: req.body.email,
  };
  const userInfoData = {
    name: req.body.name,
    profileurl: req.body.profileurl,
    statement_of_intent: req.body.statement_of_intent,
    country: req.body.country,
    dateofbirth: req.body.dateofbirth,
  };

  /* Inserts the user into userAuth, then into userInfo table. */
  userAuth.registerAuth(userAuthData).then(() => userAuth.registerInfo(userInfoData)).then(() => {
    res.render('/main');
  }).catch((err) => console.log(err));
};

// handles the login
exports.login = async (req, res) => {
  const userAuthData = {
    email: req.body.email,
    password: req.body.password,
  };
  const checkUser = userAuth.login(userAuthData);
  checkUser.then(([rows]) => {
    const loginUserId = rows[0].id;
    if (rows[0].password === userAuthData.password) {
      console.log(`----------------Logged in as: ${loginUserId}----------------`);
      res.render('main', { userId: loginUserId });
    } else {
      console.log('Password Mismatch!');
      res.redirect(304, '/');
    }
  });
};

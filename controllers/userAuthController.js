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
  /* Inserts the user into userAuth, then into userInfo table.
     After successful database insertions, redirects the user to
     the login page. */
  userAuth.registerAuth(userAuthData).then(() => {
    userAuth.getId(userAuthData).then(([rows]) => {
      console.log(userInfoData);
      const { userAuthID } = rows[0];
      userAuth.registerInfo(userAuthID, userInfoData).then(() => {
        res.redirect(301, '/');
      });
    });
  });
};

// handles the login
exports.login = (req, res) => {
  const userAuthData = {
    email: req.body.email,
    password: req.body.password,
  };
  const checkUser = userAuth.login(userAuthData);
  checkUser.then(([rows]) => {
    /* Set the session info here, with userAuth table rows. */
    // eslint-disable-next-line prefer-destructuring
    req.session.userAuth = rows[0];

    if (rows[0].userPassword === userAuthData.password) {
      res.redirect(301, '/main');
    } else {
      /* When we have session set up, we should actually re-render this page
         with appropriate warning message on the front-end. */
      res.redirect(301, '/');
    }
  });
};

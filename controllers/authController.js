const bcrypt = require('bcrypt');

const User = require('../models/userModel');

const loginLocalFailed = (req, res, next) => {
  res
    .status(401)
    .json({ error: { message: 'Username or password is incorrect.' }, statusCode: 401 });
};

const logoutRequest = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      res
        .status(400)
        .json({ error: { message: "Something went wrong!" }, statusCode: 400 });
    }
    res
      .status(200)
      .json({ success: { message: "User logged out!" }, statusCode: 200 });
  });
};

const signupRequest = (req, res, next) => { //signupRequest
  const { firstName, lastName, username, password } = req.body;
  // encrypt the password and create a new User object with the hashed password
  bcrypt.hash(password, 10, async (error, hashedPassword) => {
    if (error) {
      return next(error);
    }
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword
    });

    try {
      await newUser.save();
      req.login(newUser, (err) => {
        if (err) {
          res
            .status(400)
            .json({ error: { message: "Something went wrong while signing up!" }, statusCode: 400 });
        }
      });
      res
        .status(201)
        .json({ success: { message: "New user is created" }, data: { firstName, lastName, username }, statusCode: 201 });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern.username) {
        // Duplicate key error for the username field
        res
          .status(400)
          .json({ error: { message: 'Username already exists.' }, statusCode: 400 });
      } else {
        res
          .status(500)
          .json({ error: { message: 'Internal server error.' }, statusCode: 500 });
      }
    }
  });
};

module.exports = { loginLocalFailed, logoutRequest, signupRequest };
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash"); // use to pick properties from objects
const bcrypt = require("bcrypt"); // use to encrypt password
const { User, validate, validatePassword } = require("../models/User"); // import the User class model, the validate and the validatePassword function from models folder
const express = require("express");
const userRouter = express.Router(); // create a userRouter object
// ============================= REGISTER USERS ROUTE ====================================
userRouter.post("/", async (req, res) => {
  const myResp = () => res.status(400).send(error.details[0].message); // create a response function.
  let { error } = validate(req.body); // verify the user inputs
  if (error) return myResp(); // if there is an error send the message
  error = validatePassword(req.body.password); // verify the password strongness, if there is no error it returns the inputed password.
  if (error !== req.body.password) {
    return myResp(); // if the password is weak send that response.
  }

  let user = await User.findOne({ email: req.body.email }); // try to find a user in the database
  if (user) return res.status(400).send("User already registered"); // if the user already exists in our database send the message.
  user = new User(_.pick(req.body, ["name", "email", "password"])); // if the user does not exist, create a new user object using the User class from req.body
  const salt = await bcrypt.genSalt(12); // create a salt to encrypt the the newly created user password
  user.password = await bcrypt.hash(user.password, salt); // encrypt the plain text password, and replace it by the encrypted one in the user object.

  await user.save(); // save the user object to the database with the encrypted password.
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "email", "_id"])); // pick property we want and send the saved user back to the client as a response.
});

userRouter.get("/login", (req, res) => {
  res.render("login", { message: null, successMes: null });
});
module.exports = userRouter; // export the userRouter

// for login users
const JOI = require("joi"); // use to verify user inputs
const { User } = require("../models/User"); // import the User class from models.
const bcrypt = require("bcrypt"); // use to encrypt password
const express = require("express"); // load the express module to get the router object.
const authRouter = express.Router(); // create a custom router object
// LOG IN USERS---> JSON Web Tokens: driver license 131, store it in local storage.
authRouter.post("/", async (req, res) => {
  let { error } = validate(req.body); // verify user inputs
  if (error) return res.status(400).send(error.details[0].message); // if there is an error, send the error message.

  let user = await User.findOne({ email: req.body.email }); // try to find a user in the database
  if (!user)
    return res.status(400).render("login", {
      message: "Invalid email or password",
      successMes: null
    }); // if there is no user don't give a hint
  const validPassword = await bcrypt.compare(req.body.password, user.password); // compare the simple password to the encrypted password, if they are the same returns true

  // if the password is not valid, don't give a hint
  if (!validPassword)
    return res.status(400).render("login", {
      message: "Invalid email or password",
      successMes: null
    });

  //jwt.sign("payload", "privateKey"); --> generate a token
  //"jwtPrivateKey": "envVariableName" --> put this in custom config file
  const token = user.generateAuthToken(); // access the environmentVariable from config file
  res.render("login", { message: null, successMes: "login successfully" }); // if password is good, send this response
});
// JOI validation syntax:
function validate(req) {
  const schema = {
    email: JOI.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: JOI.string()
      .min(10)
      .max(255)
      .required()
  };
  return JOI.validate(req, schema);
}
module.exports = authRouter; // export the router

const config = require("config");
const jwt = require("jsonwebtoken");
const JOI = require("@hapi/joi");
const PasswordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});
// add a method to the user object using the userSchema
userSchema.methods.generateAuthToken = function() {
  //oooooo
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin }, // payload of the token
    config.get("jwtPrivateKey")
  );
  return token;
};
function validateUser(user) {
  const schema = {
    name: JOI.string()
      .min(5)
      .max(50)
      .required(),
    email: JOI.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: JOI.string()
      .min(10)
      .max(255)
      .required(),
    isAdmin: JOI.boolean()
  };

  return JOI.validate(user, schema);
}

function validatePassword(password) {
  const options = {
    min: 10,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    symbol: 1,
    requirementCount: 2
  };

  return JOI.validate(
    password,
    new PasswordComplexity(options),
    (error, value) => {
      if (error) {
        return error;
      }

      return value;
    }
  );
}
exports.User = mongoose.model("User", userSchema); //export the User class
exports.validate = validateUser; // export the validateUser function as validate
exports.validatePassword = validatePassword; // export the validatePassword function as validatePassword

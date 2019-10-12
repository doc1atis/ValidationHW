const { User } = require("./models/User"); // load the User class
const admin = require("./middleware/admin"); // load the admin middleware
const auth = require("./middleware/auth"); // load the auth middleware
const config = require("config"); // configure environment variables settings
const logger = require("morgan"); // log requests to the console for debugging purpose
const mongoose = require("mongoose"); // to connect to MongoDB
const express = require("express"); // load express
const userRouter = require("./routes/user"); // load userRouter
const authRouter = require("./routes/auth"); // load the authRouter
const app = express(); // create the app object
// STOP THE APP FROM LOADING IF THE PRIVATEKEY IS NOT DEFINED IN THE ENVIRONMENT VARIABLE
// "jwtPrivateKey":"APP_jwtPrivateKey" --> this is just a mapping to the env variable Name
// "APP_jwtPrivateKey" --> this is the env variable Name
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...!!!");
  process.exit(1); // 0 means success, anything else means failure
}
mongoose.connect(
  "mongodb://localhost/Vidly",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  function(error) {
    if (error) {
      console.log("there was an error Olgy: ", error);
      return;
    }
    console.log("connected to MONGO_DB Olgy");
  }
);

app.use(express.urlencoded({ extended: true })); // form
app.use(express.json()); // json
app.use(logger("dev")); // log request in the console
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/register", userRouter);
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("connected to app");
});
app.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); // exclude the password property
  res.send(user);
});
app.post("/genre", auth, (req, res) => {
  res.send("posted genre");
});
// ROLE BASED AUTHORIZATION, A VARIABLE DEFINED IN AUTH, WILL BE ACCESSIBLE BY ADMIN
app.delete("/genre", [auth, admin], async (req, res) => {
  res.send("genre deleted");
});
// TO LOG OUT USERS, DELETE THE TOKEN STORED IN THE LOCAL STORAGE OF THE USER
// ROLE BASE AUTHORIZATION --> 140
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

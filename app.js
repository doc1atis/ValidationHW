const { User } = require("./models/User");
const admin = require("./middleware/admin");
const auth = require("./middleware/auth");
const config = require("config"); // configure environment variables settings
const logger = require("morgan"); // log requests to the console for debugging purpose
const mongoose = require("mongoose"); // to connect to MongoDB
const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const app = express();
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
app.delete("/genre", [auth, admin], async (req, res) => {
  res.send("genre deleted");
});
// TO LOG OUT USERS, DELETE THE TOKEN STORED IN THE LOCAL STORAGE OF THE USER
// ROLE BASE AUTHORIZATION --> 140
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

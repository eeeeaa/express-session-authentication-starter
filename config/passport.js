const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { validPassword } = require("../lib/passwordUtils");

//define field name that passport will look for username/password (optional)
//if no custom field, then the default is `username` and `password`
const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

//verify username/password
const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const isValid = validPassword(password, user.hash, user.salt);
    if (!isValid) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

//create strategy
const strategy = new LocalStrategy(customFields, verifyCallback);

//setup passport middleware
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

exports.isAuth = (req, res, next) => {
  // This is one way to check if a user is authenticated and protect a route.
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .send(
        '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
      );
  }
};

//can also check for custom parameters
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res
      .status(401)
      .send(
        '<h1>You are not authorized for admin route</h1><p><a href="/login">Login</a></p>'
      );
  }
};

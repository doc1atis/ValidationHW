// ROLE BASE AUTHORIZATION
module.exports = function(req, res, next) {
  // req.user is defined by the auth middleware function, it runs before the admin middleware function.
  // 403 Forbidden
  if (!req.user.isAdmin) return res.status(403).send("Access denied."); // if user is not an admin
  next(); // if user is admin, pass control to the next middleware function in the chain.
};

//------------ Routing via Auth ------------//
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in first!');
        res.redirect('/login');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    }
};
module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        return next()
      }
      
      req.flash('error_msg', 'You are not authorize to view this page !!!');
      req.logout();
      res.redirect('/login');
    };
  };
function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Please sign in to continue.');
    return res.redirect('/auth/login');
  }

  next();
}

function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/employee');
  }

  next();
}

module.exports = {
  requireGuest,
  requireLogin,
};

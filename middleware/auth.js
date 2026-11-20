module.exports = {
  // Ensure user is authenticated
  isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'Sesi Anda telah berakhir atau Anda belum login. Silakan masuk terlebih dahulu.');
    res.redirect('/auth/login');
  },

  // Ensure user is guest (not logged in)
  isGuest(req, res, next) {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    next();
  },

  // Role-based access control
  hasRole(roles = []) {
    return (req, res, next) => {
      if (!req.session || !req.session.user) {
        req.flash('error', 'Akses ditolak. Silakan login terlebih dahulu.');
        return res.redirect('/auth/login');
      }

      const userRole = req.session.user.role;
      if (roles.includes(userRole)) {
        return next();
      }

      // If forbidden for this role
      return res.status(403).render('error/403', {
        title: 'Akses Ditolak',
        message: `Role Anda (${userRole}) tidak memiliki izin untuk mengakses halaman ini.`
      });
    };
  },

  // Setup template locals
  setLocals(req, res, next) {
    res.locals.currentUser = req.session ? req.session.user : null;
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.warningMsg = req.flash('warning');
    res.locals.infoMsg = req.flash('info');
    res.locals.currentPath = req.path;
    next();
  }
};


// Example of checkUserSession middleware
const checkUserSession = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');  // Redirect to login if user is not logged in
    }
    next();  // Proceed if user is logged in
};


function checkAdminSession(req, res, next) {
    if (req.session.adminId) {
        next();
    } else {
        res.redirect('/admin');
    }
}

module.exports = {
    checkUserSession,
    checkAdminSession
};

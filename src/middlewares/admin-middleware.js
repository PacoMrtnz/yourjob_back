const adminAuth = (req, res, next) => {
    // console.log(req.user);
    if (req.user.accountType !== "admin" && req.user.accountType !== "company") {
        return res.send('No eres administrador o empresa');
    }
    next();
};

module.exports =  adminAuth;
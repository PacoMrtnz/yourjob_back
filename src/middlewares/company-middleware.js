const companyAuth = (req, res, next) => {
    if (req.user.account !== "company") {
        return res.send('No eres una empresa')
    }
    next()
}

module.exports =  companyAuth;
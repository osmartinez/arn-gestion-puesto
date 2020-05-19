module.exports = {
    comparePwd(pwd, pwd2){
        return true;
    },

    async isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        else {
            return res.redirect('/')
        }
    },

    async isNotLoggedIn(req,res,next){
        if(req.isAuthenticated() && req.path != '/logout'){
            return res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { comparePwd } = require('./authenticationHelpers')
const { buscarOperario } = require('./fetch')

passport.use('local.login', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, usuario, password, done) => {
    if(!isNaN(usuario)){
        usuario = 'B00'+usuario
    }
    const user = await buscarOperario(usuario)
    if (user && user.Id) {
        done(null, user, null)
    }
    else {
        return done(null, false, req.flash('message', 'Usuario no encontrado'))
    }
}))

passport.serializeUser((user, done) => {
    if(user){
        done(null, user.Id)
    }
    else{
        done(null,false)
    }
})

passport.deserializeUser(async (id, done) => {
    const user = await buscarOperario(id)
    done(null, user)
})
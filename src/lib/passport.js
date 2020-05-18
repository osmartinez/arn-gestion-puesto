const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {comparePwd} = require('../lib/authenticationHelpers')
const pool = require('../db_pool');


passport.use('local.login', new LocalStrategy({
    usernameField: 'dni',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, idOperario, clave, done) => {

    let res = await pool.exec_procedure('FindOperarioById', [{ name: 'IdOperario', value: idOperario }])
    let rows = res.recordset

    if (rows.length == 1) {
        const user = rows[0]
        const comparisonResult = await comparePwd(clave, user.Clave)
        if (comparisonResult) {
            done(null, user, null)
        }
        else {
            done(null, false, req.flash('message', 'Clave incorrecta'))
        }
    }
    else {
        return done(null, false, req.flash('message', 'Usuario no encontrado'))

    }

}))


passport.serializeUser((user, done) => {
    done(null, user.IdOperario)
})

passport.deserializeUser(async (id, done) => {
    let res = await pool.exec_procedure('FindOperarioById', [{ name: 'IdOperario', value: id }])
    let rows = res.recordset
    done(null, rows[0])
})
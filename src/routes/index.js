const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isNotLoggedIn} = require('../lib/authenticationHelpers')

router.get('/',isNotLoggedIn,(req,res)=>{
    res.render('index')
})

router.post('/sign-in',isNotLoggedIn,(req,res,next)=>{
    console.log('hola')
    passport.authenticate('local.login',{
        failureRedirect: '/',
        successRedirect: '/dashboard',
        failureFlash: true,
    })(req,res,next)
})

router.get('/error', (req,res,next)=>{
    res.render('error')
})

router.get('/logout',isNotLoggedIn,(req,res,next)=>{
    req.logOut()
    res.redirect('/')
})

module.exports = router
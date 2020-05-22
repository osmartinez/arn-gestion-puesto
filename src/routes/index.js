const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isNotLoggedIn} = require('../lib/authenticationHelpers')

router.get('/',isNotLoggedIn,(req,res)=>{
    res.render('dashboard/index',{layout: 'main-dashboard'})
})

module.exports = router
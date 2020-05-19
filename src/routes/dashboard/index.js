const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../../lib/authenticationHelpers')

router.get('/',isLoggedIn,(req,res)=>{
    res.render('dashboard/index', {layout: 'main-dashboard'})
})

router.get('/settings', isLoggedIn,(req,res)=>{
    res.render('dashboard/settings', {layout: 'main-dashboard'})
})


module.exports = router
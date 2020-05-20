const express = require('express')
const router = express.Router()
const {isLoggedIn} = require('../../lib/authenticationHelpers')
const {buscarOrden} = require('../../lib/fetch')

router.get('/',isLoggedIn,(req,res)=>{
    res.render('dashboard/index', {layout: 'main-dashboard'})
})

router.get('/settings', isLoggedIn,(req,res)=>{
    res.render('dashboard/settings', {layout: 'main-dashboard'})
})

router.get('/task',isLoggedIn,(req,res)=>{
    res.render('dashboard/task',{layout: 'main-dashboard'})
})

router.get('/buscarOrden/:idOrden',async (req,res)=>{
    const {idOrden} = req.params
    var orden = await buscarOrden(idOrden)
    res.json(orden)
})

module.exports = router
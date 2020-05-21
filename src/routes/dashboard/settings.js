const {isLoggedIn} = require('../../lib/authenticationHelpers')
const {buscarTodasSecciones,buscarMaquinasEnSeccion} =  require('../../lib/fetch')
module.exports = function(router){
    router.get('/settings', isLoggedIn,async (req,res)=>{
        const secciones = await buscarTodasSecciones()
        res.render('dashboard/settings', {layout: 'main-dashboard', secciones: secciones})
    })

    router.get('/settings/maquinasEnSeccion/:codSeccion',async (req,res)=>{
        const {codSeccion} = req.params
        var maquinas = await buscarMaquinasEnSeccion(codSeccion)
        res.json(maquinas)
    })
}
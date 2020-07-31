const {buscarTodasSecciones,buscarMaquinasEnSeccion} =  require('../../lib/fetch')
const configParams = require('../../lib/config.params')

module.exports = function(router){
    router.get('/settings',async (req,res)=>{
        const secciones = await buscarTodasSecciones()
        let maquinas = []
        const data = configParams.read()
        if(data.puesto.seccion){
            maquinas = await buscarMaquinasEnSeccion(data.puesto.seccion)
        }
        res.render('dashboard/settings', {layout: 'main-dashboard', secciones: secciones, maquinas: maquinas, puesto: data.puesto})
    })

    router.post('/settings/maquinasEnSeccion',async (req,res)=>{
        const {codSeccion} = req.body
        var maquinas = await buscarMaquinasEnSeccion(codSeccion)
        res.json(maquinas)
    })

    router.post('/settings',async (req,res)=>{
        const {seccion, maquina, ritmo} = req.body
        await configParams.write(seccion,maquina,ritmo)
        res.redirect('/dashboard')
    })

    router.post('/settings/secciones',async(req,res)=>{
        const secciones = await buscarTodasSecciones()
        console.log(secciones)
        res.json(secciones)
    })
}
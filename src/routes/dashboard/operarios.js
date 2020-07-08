const {buscarOperario, entradaOperarioPuesto, salidaOperarioPuesto} =  require('../../lib/fetch')
const configParams = require('../../lib/config.params')


module.exports = function(router){
    router.get('/operarios',async (req,res)=>{
        res.render('dashboard/operarios', {layout: 'main-dashboard'})
    })

    router.post('/operarios/entrada',async (req,res)=>{
        const {codigo} = req.body
        var idPuesto =  configParams.read().puesto.maquina.ID
        const operario = await entradaOperarioPuesto(codigo, idPuesto)
        res.json(operario)
    })

    router.post('/operarios/salida',async (req,res)=>{
        const {codigo} = req.body
        var idPuesto =  configParams.read().puesto.maquina.ID
        const operario = await salidaOperarioPuesto(codigo,idPuesto)
        res.json(operario)
    })
}
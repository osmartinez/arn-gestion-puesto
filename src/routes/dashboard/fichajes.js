const configParams = require('../../lib/config.params')
const puestoWebService = require('../../lib/repository/puesto.ws')()

module.exports = function(router){
    router.get('/operarios',async (req,res)=>{
        res.render('dashboard/fichajes/index', {layout: 'main-dashboard'})
    })

    router.post('/fichajes/entrada',async (req,res)=>{
        const {codigo} = req.body
        var idPuesto =  configParams.read().Id
        const operarios = await puestoWebService.entradaOperarioPorCodigoObrero(idPuesto,codigo)
        res.json(operarios)
    })

    router.post('/fichajes/salida',async (req,res)=>{
        const {codigo} = req.body
        var idPuesto =  configParams.read().Id
        const operarios = await puestoWebService.salidaOperarioPorCodigoObrero(idPuesto,codigo)
        res.json(operarios)
    })
}
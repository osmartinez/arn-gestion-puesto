const {buscarPrepaquete} =  require('../../lib/fetch')
const configParams = require('../../lib/config.params')

module.exports = function(router){
    router.get('/tarea',(req,res)=>{
        res.render('dashboard/tarea/index',{layout: 'main-dashboard'})
    })
    
    /*router.get('/task/buscarPrepaquete/:codigoPrepaquete/:codigoSeccion', async (req,res)=>{
        const {codigoPrepaquete, codigoSeccion} = req.params
        const prepaquetes = await buscarPrepaquete(codigoPrepaquete, codigoSeccion)
        res.json(prepaquetes)
    })*/
}
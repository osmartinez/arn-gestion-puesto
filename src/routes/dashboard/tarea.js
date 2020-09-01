const {buscarPrepaquete} =  require('../../lib/fetch')
const configParams = require('../../lib/config.params')

module.exports = function(router){
    router.get('/tarea',(req,res)=>{
        res.render('dashboard/tarea/index',{layout: 'main-dashboard'})
    })

    router.post('/tarea/prepaquete',async (req,res)=>{
        try{
            let codigoPrepaquete = req.body.codigoPrepaquete
            let prepaquete = await buscarPrepaquete(codigoPrepaquete,'520')
            res.json(prepaquete) 
        }catch(err){
            console.log(err)
            res.sendStatus(500)
        }
    })
    
    /*router.get('/task/buscarPrepaquete/:codigoPrepaquete/:codigoSeccion', async (req,res)=>{
        const {codigoPrepaquete, codigoSeccion} = req.params
        const prepaquetes = await buscarPrepaquete(codigoPrepaquete, codigoSeccion)
        res.json(prepaquetes)
    })*/
}
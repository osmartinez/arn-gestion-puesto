const {buscarOperario} =  require('../../lib/fetch')

module.exports = function(router){
    router.get('/operarios',async (req,res)=>{
        res.render('dashboard/operarios', {layout: 'main-dashboard'})
    })

    router.post('/operarios/buscarPorCodigo',async (req,res)=>{
        const {codigo} = req.body
        const operario = await buscarOperario(codigo)
        res.json(operario)
    })
}
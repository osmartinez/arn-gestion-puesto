const {buscarTodasSecciones,buscarMaquinasEnSeccion} =  require('../../lib/fetch')

module.exports = function(router){
    router.get('/operarios',async (req,res)=>{
        res.render('dashboard/operarios', {layout: 'main-dashboard'})
    })

    
}
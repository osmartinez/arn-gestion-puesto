
module.exports = function(router){
    router.get('/incidencia-fichaje',async (req,res)=>{
        res.render('dashboard/incidencia-fichaje', {layout: 'main-dashboard'})
    })

}
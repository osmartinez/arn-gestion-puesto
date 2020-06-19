
module.exports = function(router){
    router.get('/averia',async (req,res)=>{
        res.render('dashboard/averia', {layout: 'main-dashboard'})
    })

}
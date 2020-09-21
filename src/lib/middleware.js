const configParams = require('./config.params')
const puestoWebservice = require('../lib/repository/puesto.ws')()
module.exports = {
    async middle(app,req,res,next){
        const data = configParams.read();
        app.locals.Puesto = data
        if(app.locals.Puesto.Id){
            app.locals.Operarios = await puestoWebservice.buscarOperariosActuales(app.locals.Puesto.Id)
        }
        next()
    }
}
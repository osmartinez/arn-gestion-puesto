const configParams = require('./config.params')

module.exports = {
    middle(req,res,next){
        const data = configParams.read();
        req.puesto = data.puesto
        next()
    }
}
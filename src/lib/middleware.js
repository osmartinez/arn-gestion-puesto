const configParams = require('./config.params')
const MovimientoOperario = require('./model/movimientoOperario.model')


const multipleMongooseToObj = (arrayOfMongooseDocuments) => {
    const tempArray = [];
    if (arrayOfMongooseDocuments.length !== 0) {
        arrayOfMongooseDocuments.forEach(doc => tempArray.push(doc.toObject()));
    }
    return tempArray;
};

module.exports = {
    async middle(app, req, res, next) {
        try {
            const data = configParams.read();
            if (data == null)
                return next()
            app.locals.Puesto = data
            if (app.locals.Puesto.Id) {
                app.locals.Operarios = multipleMongooseToObj(await MovimientoOperario.find({ idPuestoSql: data.Id, fechaSalida: null }))
            }
        } catch (err) {
            console.error('[ERROR] No se pudo leer el fichero de configuracion')
        }
        return next()
    }
}
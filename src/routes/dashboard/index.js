const express = require('express')
const configParams = require('../../lib/config.params')
const Tarea = require('../../lib/model/tarea.model')
const router = express.Router()

router.get('/',async (req,res)=>{

    try {
        // leo el puesto del fichero de configuracion
        puesto = configParams.read()
        // si no hay puesto redirijo al dashboard
        if (puesto == null || !puesto.Id) {
            return  res.render('dashboard/index', {layout: 'main-dashboard'})
        }
        else {
            // si hay puesto busco si tiene tarea actualmente en proceso
            let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
            if(tareaActual==null){
                // si no tiene tarea redirijo al dashboard
               return  res.render('dashboard/index', {layout: 'main-dashboard'})
            }
            else{
                // si no redirijo a la página de tarea
               return res.redirect('/dashboard/tarea')
            }
        }
    } catch (err) {
        console.error(err)
        return  res.render('dashboard/index', {layout: 'main-dashboard'})
    }

})

// subrutas
require('./settings')(router)
require('./fichajes')(router)
require('./averia')(router)
require('./incidencia-fichaje')(router)
require('./gpio')(router)
require('./tarea/incidencia')(router)
require('./tarea/tarea')(router)



module.exports = router
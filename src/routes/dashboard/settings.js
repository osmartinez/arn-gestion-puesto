const {buscarTodasSecciones,buscarMaquinasEnSeccion,buscarMaquina} =  require('../../lib/fetch')
const configParams = require('../../lib/config.params')
const puestoWebservice = require('../../lib/repository/puesto.ws')()
const maquinaWebService = require('../../lib/repository/maquina.ws')()

module.exports = function(router){
    router.get('/settings',async (req,res)=>{
        const secciones = await buscarTodasSecciones()
        let maquinas = []
        const data = configParams.read()
        if(data.puesto.seccion){
            maquinas = await buscarMaquinasEnSeccion(data.puesto.seccion)
        }
        res.render('dashboard/settings/index', {layout: 'main-dashboard', secciones: secciones, maquinas: maquinas, puesto: data.puesto})
    })

    router.post('/settings/buscarMaquina',async (req,res)=>{
        const {codigoMaquina} = req.body
        var maquina = await maquinaWebService.buscarPorCodigo(codigoMaquina)
        res.json(maquina)
    })

    router.post('/settings/maquinasEnSeccion',async (req,res)=>{
        const {codSeccion} = req.body
        var maquinas = await buscarMaquinasEnSeccion(codSeccion)
        res.json(maquinas)
    })

    router.post('/settings',async (req,res)=>{

        const puesto = req.body
        console.log(puesto)
        if(puesto.CrearNuevo){
            const puestoNuevo = await puestoWebservice.crear(puesto.Descripcion, puesto.Observaciones,
                puesto.PuestosConfiguracionesPins.PinBuzzer,puesto.PuestosConfiguracionesPins.PinLed)
            if( puestoNuevo != null && puestoNuevo.Id > 0){
                for(const maquina of puesto.Maquinas){
                    await maquinaWebService.actualizarConfiguracionPines(maquina.ID,maquina.EsPulsoManual,maquina.ProductoPorPulso, maquina.PinPulso)
                    puestoNuevo.Maquinas = await maquinaWebService.asociarAPuesto(maquina.ID, puestoNuevo.Id)
                }
            }

            console.log(puestoNuevo)
        }
    })

    router.post('/settings/secciones',async(req,res)=>{
        const secciones = await buscarTodasSecciones()
        res.json(secciones)
    })
}
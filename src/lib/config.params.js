
const fs = require('fs')
const {buscarMaquina} = require('./fetch')
module.exports = {
    read(){
        const raw = fs.readFileSync('./config.params.json')
        return JSON.parse(raw)
    },
    async write(seccion,maquina,ritmo){
        var data = this.read()
        data.puesto.seccion = seccion? seccion:data.puesto.seccion
        if(maquina){
            data.puesto.maquina = await buscarMaquina(maquina)
        }
        data.puesto.ritmo = ritmo? ritmo: data.puesto.ritmo
        fs.writeFileSync('./config.params.json',JSON.stringify(data))
    }
}
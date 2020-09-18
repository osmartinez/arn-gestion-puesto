
const fs = require('fs')
const {buscarMaquina} = require('./fetch')
module.exports = {
    read(){
        const raw = fs.readFileSync('./config.params.json')
        return JSON.parse(raw)
    },
    async write(puesto){
        fs.writeFileSync('./config.params.json',JSON.stringify(puesto))
    }
}

const fs = require('fs')
const { buscarMaquina } = require('./fetch')
module.exports = {
    read() {
        const raw = fs.readFileSync('./config.params.json')
        if (raw == null || raw=='') {
            return {}
        }
        else {
            try {
                return JSON.parse(raw)
            }
            catch (err) {
                console.error(err)
                return {}
            }
        }
    },
    async write(puesto) {
        fs.writeFileSync('./config.params.json', JSON.stringify(puesto))
    }
}
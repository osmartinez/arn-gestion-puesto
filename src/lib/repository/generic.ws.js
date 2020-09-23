const config = require('../../../config');
const env = process.env.NODE_ENV || 'production';
const port = config[env].rest.port
const host = config[env].rest.host
const url = `http://${host}:${port}/api`
const fetch = require('node-fetch');


function GenericWebservice() {

    function armarRuta(args) {
        let ruta = url
        for(const arg of args){
            ruta += '/'+arg
        }
        return ruta
    }

    async function get() {
        let ruta = armarRuta(arguments)
        return await fetch(ruta)
    }

    async function post(body, ...args) {
        let ruta = armarRuta(args)
        return await fetch(ruta, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
    }

    return {
        get,
        post
    }
}

module.exports = GenericWebservice
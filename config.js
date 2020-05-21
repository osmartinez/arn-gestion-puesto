var config = {
    development: {
        server: {
            host: '192.168.0.109',
            port: '3000'
        }
    },
    production: {
            server: {
            host: '192.168.0.104',
            port: '3000'
        }
    },
    puesto:{
        codSeccion: '080',
        idMaquina: 570,
        rendimientoIdeal: 100,
    }
};
module.exports = config;
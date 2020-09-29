var config = {
    development: {
        server: {
            host: '192.168.0.109',
            port: 8080,
        },
        rest:{
            host: '192.168.0.109',
            port: 3000,
        },
        database:{
            host:'localhost',
            port:27017,
            name: 'test',
        }
    },
    production: {
        server: {
            host: '192.168.0.104',
            port: '3000'
        },
        rest:{
            host: '192.168.0.109',
            port: 3000,
        },
        database:{
            host:'192.168.0.109',
            port:27017,
            name: 'test',
        }
    },
};
module.exports = config;
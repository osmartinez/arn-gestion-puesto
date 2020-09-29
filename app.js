const express = require ('express')
const env = process.env.NODE_ENV || 'production'
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser');
const validator = require('express-validator');
const middlewares = require('./src/lib/middleware')
const config = require('./config')
const mongoose = require('mongoose')
const GpioConfiguracion = require('./src/lib/pins/gpio.config')
const configParams = require('./src/lib/config.params')

// inicializar express
const app = express()
GpioConfiguracion.iniciar()
const puestoActual = configParams.read()
if(puestoActual!=null && puestoActual.Id){
    GpioConfiguracion.configurarPuesto(puestoActual)
}

// conexion db nosql
mongoose.connect('mongodb://' + config[env].database.host + '/' + config[env].database.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// configuracion
app.set('views',path.join(__dirname,'src/views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./src/lib/handlebars') // ruta helpers para handlebar
}))
app.set('view engine', '.hbs')

// middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(validator());

// global var
app.use(async (req, res, next) => {
    await middlewares.middle(app,req,res,next)
  });


// routes
app.use(require('./src/routes/index'))
app.use('/dashboard',require('./src/routes/dashboard/index'))

// public
app.use(express.static(path.join(__dirname,'src/public')))

Array.prototype.sum = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
}


// start server
const serverPort = config[env].server.port
const server = app.listen(serverPort,()=>{
    console.log(`[${env}] arn-gestion-puesto up and running on port ${serverPort}`)
})

module.exports = server

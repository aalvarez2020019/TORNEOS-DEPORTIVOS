// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();


// RUTAS
const UsuariosRutas = require('./src/routes/usuarios.routes');
const LigasRutas = require('./src/routes/ligas.routes');
const EquipoRutas = require('./src/routes/equipo.routes');
const PartidoRutas = require('./src/routes/partido.routes');
const LigasPdfRutas = require('./src/routes/ligaspdf.routes');

// MIDDLEWARE INTERMEDIARIO
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERA
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuariosRutas, LigasRutas, EquipoRutas, PartidoRutas, LigasPdfRutas);


module.exports = app;



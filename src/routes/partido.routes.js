const express = require('express');
const partidosController = require('../controllers/partido.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();


// CREAR UN PARTIDO
api.post('/crearPartido/:liga/:idUsuario?', md_autentificacion.Auth, partidosController.crearPartido);

// VER TABLA LIGA
api.get('/verTablaLiga/:liga/:idUsuario?', md_autentificacion.Auth, partidosController.tablaLiga);


module.exports = api

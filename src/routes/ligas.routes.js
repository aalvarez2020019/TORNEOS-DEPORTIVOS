const express = require('express');
const ligasController = require('../controllers/ligas.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// CREAR LIGA
api.post('/crearLiga/:idUsuario?', md_autentificacion.Auth, ligasController.crearLigaDeportiva);


// ELIMINAR LIGA
api.delete('/eliminarLiga/:idLiga?', md_autentificacion.Auth, ligasController.eliminarLiga)

// VER LIGAS
api.get('/verLigas/:idUsuario?', md_autentificacion.Auth, ligasController.verLigas);

// EDITAR LIGA
api.put('/editarLiga/:nombreLiga/:idUsuario?', md_autentificacion.Auth, ligasController.editarLigas);


module.exports = api

const express = require('express');
const equipoController = require('../controllers/equipo.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// CREAR EQUIPO
api.post('/crearEquipo/:idLiga?/:UsuarioId?', md_autentificacion.Auth, equipoController.crearEquipo);

// EDITAR EQUIPO
api.put('/editarEquipo/:idLiga?/:idEquipo?/:UsuarioId?', md_autentificacion.Auth, equipoController.editarEquipo);

// ELIMINAR EQUIPO
api.delete('/eliminarEquipo/:nombreEquipo/:idUsuario?', md_autentificacion.Auth, equipoController.eliminarEquipo);

// VER EQUIPOS
api.get('/listadoEquiposLiga/:liga/:idUsuario?', md_autentificacion.Auth, equipoController.verEquiposLigas);

module.exports = api


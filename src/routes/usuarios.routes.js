const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// LOGIN
api.post('/login', usuariosController.login)

// REGISTRAR TIPO USUARIO
api.post('/registrarUsuario', md_autentificacion.Auth, usuariosController.registrarUsuario);

// REGISTRAR ADMIN
api.post('/registrarAdmin', usuariosController.registrarNuevoAdmin);

// EDITAR USUARIO
api.put('/editarUsuario/:idUsuario', md_autentificacion.Auth, usuariosController.EditarUsuario);

// ELIMINAR USUARIOS
api.delete('/eliminarUsuario/:idUsuario', md_autentificacion.Auth, usuariosController.eliminarUsuarios);

// VISUALIZAR USUARIOS
api.get('/verUsuarios', md_autentificacion.Auth, usuariosController.visualizarUsuarios);

// EDITAR CUENTA USUARIOS
api.put('/editarCuenta', md_autentificacion.Auth, usuariosController.editarPerfil);

// ELIMINAR CUENTA USUARIOS
api.delete('/eliminarCuenta', md_autentificacion.Auth, usuariosController.eliminarPerfil);


module.exports = api

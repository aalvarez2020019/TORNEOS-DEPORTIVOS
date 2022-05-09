const express = require('express');
const ligasPdfController = require('../controllers/ligasPdf.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

// GENERAR REPORTE LIGA
api.post('/generarReporte/:liga/:idUsuario?', md_autentificacion.Auth, ligasPdfController.generarReporte);


module.exports = api

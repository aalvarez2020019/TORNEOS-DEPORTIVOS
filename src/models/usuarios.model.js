// MODELO DE USUARIOS
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    
    usuario: String,
    password:String,
    rol: String,
     
});


module.exports = mongoose.model('Usuarios', UsuariosSchema);
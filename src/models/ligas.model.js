// MODELO DE LIGAS
const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LigasSchema = Schema({ 
    
    nombreLiga: String,
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'}

});

module.exports = mongoose.model('Ligas', LigasSchema);

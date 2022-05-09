// MODELO DEL PARTIDO
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartidoSchema = Schema({
    idEquipo1: {type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesEquipo1: Number,
    idEquipo2: {type: Schema.Types.ObjectId, ref: 'Equipos'},
    golesEquipo2: Number,
    Liga: {type: Schema.Types.ObjectId, ref: 'Liga'},
    jornada: Number
});

module.exports = mongoose.model('Partidos', PartidoSchema);
const Ligas = require('../models/ligas.model');
const bcrypt = require('bcrypt-nodejs');

// VISUALIZAR LIGAS
function verLigas(req, res) {

  var idUsuario;

  if (req.user.rol == "ROL_USUARIO") {

      idUsuario = req.user.sub;

  } else if (req.user.rol == "ROL_ADMIN") {

      if (req.params.idUsuario == null) {

        return res.status(500).send({mensaje: "debe enviar el id del usuario"});
      }
      idUsuario = req.params.idUsuario;
  }

  Ligas.find({ idUsuario: idUsuario }, (err, verLigas) => {

      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

      if (verLigas == null)
          return res.status(500).send({ error: "No se pudo encontrar las ligas" });

      if (verLigas.length == 0)
          return res.status(500).send({ error: "No cuenta con ligas" });

      return res.status(200).send({ ligas: verLigas });
  });
}

// FUNCION DE NUEVA LIGA
function crearLigaDeportiva(req, res) {

  var parametros = req.body;
    var LigaModel = new Ligas();
    var idUsuario;

    if (req.user.rol == "ROL_USUARIO") {
        idUsuario = req.user.sub;

    } else if (req.user.rol == "ROL_ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({mensaje: "debe enviar el id del usuario"});
        }
        
        idUsuario = req.params.idUsuario;
    }

    Ligas.findOne(

        { idUsuario: idUsuario, nombreLiga: parametros.nombreLiga },
        (err, ligaEncontrada) => {
            if (ligaEncontrada){
                return res.status(500).send({ error: "Ya existe la liga, escrib otra" });
            }

            if (parametros.nombreLiga) {
                LigaModel.nombreLiga = parametros.nombreLiga;
                LigaModel.idUsuario = idUsuario;
        
                LigaModel.save((err, ligaCreada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!ligaCreada)
                        return res.status(500).send({ mensaje: "Error al crear la liga" });
                        return res.status(200).send({ ligas: ligaCreada });
                });
            } else {
                return res.status(500).send({ mensaje: "Llenar todos los parametros" });
            }
          
        }
    );  
      
}


// EDITAR LIGA
function editarLigas(req, res) {

    var idUsuario;

    if(req.params.nombreLiga == null) return res.status(500).send({error: "enviar el nombre de la liga que quiere editar"})

    if (req.user.rol == "ROL_USUARIO") {
        idUsuario = req.user.sub;

    } else if (req.user.rol == "ROL_ADMIN") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({mensaje: "debe enviar el id del usuario que quiere editarle su liga"});
        }

        idUsuario = req.params.idUsuario;
    }

    Ligas.findOne({idUsuario: idUsuario, nombreLiga: req.body.nombreLiga}, (err, ligaRepetida)=> {

        if(ligaRepetida){
            return res.status(500).send({ error: "ya existe una liga con ese nombre" });

        }else{

            Ligas.findOneAndUpdate({ nombreLiga: req.params.nombreLiga, idUsuario: idUsuario }, {nombreLiga:req.body.nombreLiga}, { new: true }, (err, ligaEditada) => {
                    if (ligaEditada == null)
                        return res.status(500).send({ error: "no se encontró la liga" });
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    return res.status(200).send({ liga: ligaEditada });
                }
            );
        }
    })

}

  // ELIMINAR LIGA
  function eliminarLiga(req, res) {

    var liga = req.params.idLiga;

    if (req.user.rol == "ROL_USUARIO") {

        Ligas.findByIdAndDelete({ _id: liga, idUsuario: req.user.sub }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Ocurrio un error al tratar de eliminar la liga' });
            if (!ligaEliminada) return res.status(500).send({ mensaje: 'No se pudo eliminar los datos' });

            return res.status(200).send({ ligaEliminada: ligaEliminada })
        })

    } else if (req.user.rol == 'ROL_ADMIN') {
        Ligas.findByIdAndDelete({ _id: liga }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Ocurrio un error al tratar de eliminar la liga' });
            if (!ligaEliminada) return res.status(500).send({ mensaje: 'No se pudo eliminar los datos' });

            return res.status(200).send({ ligaEliminada: ligaEliminada })
        })
    }
}




module.exports = {
    crearLigaDeportiva,
    editarLigas,
    eliminarLiga,
    verLigas
}
const Equipos = require("../models/equipo.model");
const Ligas = require("../models/ligas.model");
const Usuarios = require("../models/usuarios.model");


// VER EQUIPOS
function verEquiposLigas(req,res) {
  var idUsuario;

  if(req.params.liga==null) return res.status(500).send({error: "debe enviar el nombre de que liga quiere visualizar su tabla"})


  if (req.user.rol == "ROL_USUARIO") {
      idUsuario = req.user.sub;
  } else if (req.user.rol == "ROL_ADMIN") {

      if (req.params.idUsuario == null) {
          return res.status(500).send({ mensaje: "debe enviar el id del usuario al que quiere ver sus  equipos"});

      }

      idUsuario = req.params.idUsuario;
  }

  Ligas.findOne({nombre: req.params.liga, idUsuario: idUsuario}, (err, ligaEncontrada)=>{
      
      if(!ligaEncontrada){
          return res.status(500).send({ error: "no se encontró la liga" });
          
      }else{

          Equipos.find({idUsuario: idUsuario, idLiga: ligaEncontrada._id}, (err, encontrarEquipos)=>{

              if(encontrarEquipos.length==0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
              if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

              return res.status(200).send({  Equipos: encontrarEquipos})

          }).select('nombreEquipo');
      }
  })
}

// CREAR EQUIPO
function crearEquipo(req, res) {

    var parametros = req.body;
    var idLiga;
    var idUsuario;
    var equipoModel = new Equipos();
  
    if (req.user.rol == "ROL_ADMIN") {

      idLiga = req.params.idLiga;
      idUsuario = req.params.UsuarioId;

    } else if (req.user.rol == "ROL_USUARIO") {

      idUsuario = req.user.sub;
      idLiga = req.params.idLiga;
    }

    Ligas.findById({ _id: idLiga }, (err, encontrarLigas) => {
      if (!encontrarLigas)
        return res.status(500).send({ mensaje: "No se encontro ninguna liga" });
  
      Usuarios.findOne({ _id: encontrarLigas.idUsuario }, (err, usuarioEncontrado) => {
          idUsuario = usuarioEncontrado._id;
  
          if (req.user.rol == "ROL_USUARIO" && usuarioEncontrado._id != req.user.sub)
            return res.status(500).send({ mensaje: "No pertenece esta liga a este usuario" });
  
          Equipos.find({ Liga: idLiga }, (err, encontrarLigas) => {
            if (!encontrarLigas)
              return res.status(500).send({ mensaje: "Error al momento de encontrar" });
  
            if (encontrarLigas.length >= 10)

              return res.status(500).send({ mensaje: "Ya se cuenta con 10 equipos, no se pueden registrar más" });
  
            if (parametros.nombreEquipo) {
              equipoModel.nombreEquipo = parametros.nombreEquipo;
              equipoModel.golesFavor = 0;
              equipoModel.golesContra = 0;
              equipoModel.diferenciaGoles = 0;
              equipoModel.cantidadJugados = 0;
              equipoModel.puntos = 0;
              equipoModel.Liga = idLiga;
              equipoModel.idUsuario = idUsuario;
  
              Equipos.findOne({nombreEquipo: parametros.nombreEquipo, Liga: req.params.idLiga}, (err, nombreEncontrado) => {
                  if (nombreEncontrado == null) {
                    equipoModel.save((err, equipoGuardado) => {

                      if (err)
                        return res.status(500).send({ mensaje: "Error en la peticion" });
                      if (!equipoGuardado)
                        return res.status(404).send({ mensaje: "No se encontraron equipos" });
  
                      return res.status(200).send({ equipo: equipoGuardado });
                    });
                  } else {
                    return res.status(500).send({mensaje: "Este equipo ya se encuentra registrado en la liga"});
                  }
                }
              );
            } else {
              return res.status(500).send({ mensaje: "Llenar el campo de nombreEquipo" });
            }
          });
        }
      );
    });
  }


function editarEquipo(req, res) {
  var parametros = req.body;
  var idLiga;
  var idUsuario;
  var idEquipo = req.params.idEquipo;

  if (req.user.rol == "ROL_ADMIN") {

    idLiga = req.params.idLiga;
    idUsuario = req.params.UsuarioId;

  } else if (req.user.rol == "ROL_USUARIO") {

    idUsuario = req.user.sub;
    idLiga = req.params.idLiga;
  }

  Equipos.findById({ _id: idEquipo }, (err, equipoEncontrado) => {

    if (req.user.rol == "ROL_USUARIO" && equipoEncontrado.idUsuario != req.user.sub)
      return res.status(500).send({ mensaje: "Este equipo no te pertenece" });

    Equipos.findOne({ nombreEquipo: parametros.nombreEquipo, Liga: idLiga }, (err, equipoEncontrado) => {

        if (equipoEncontrado == null) {
          Equipos.findByIdAndUpdate( { _id: idEquipo, idUsuario: idUsuario }, parametros, { new: true }, (err, equipoActualizado) => {
            
              if (err) return res.status(500).send({ mensaje: "Ocurrio un error" });
              if (!equipoActualizado)
                return res.status(500).send({ mensaje: "No se puede actualizar el equipo" });

              return res.status(200).send({ Equipo: equipoActualizado });
            }
          );
        } else {
          return res.status(500).send({ mensaje: "Existe un equipo con ese nombre" });
        }
      }
    );
  });
}




function eliminarEquipo(req, res){
  var idUsuario;

  if(req.params.nombreEquipo == null) return res.status(500).send({error: "enviar el nombre del equipo que se eliminara"})


  if (req.user.rol == "ROL_USUARIO") {

      idUsuario = req.user.sub;

  } else if (req.user.rol == "ROL_ADMIN") {

      if (req.params.idUsuario == null) {
          return res.status(500).send({mensaje: "debe enviar el id del usuario al que quiere eliminar el equipo",});
      }

      idUsuario = req.params.idUsuario;
  }
  
  Equipos.findOneAndDelete({nombreEquipo: req.params.nombreEquipo, idUsuario: idUsuario}, {nombreEquipo: req.body.nombreEquipo}, (err, equipoEditado) => {
      if (equipoEditado == null)
      return res.status(500).send({ error: "no se encontró el equipo" });
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


  return res.status(200).send({ equipo: equipoEditado });
  })

}





module.exports = {
    crearEquipo,
    editarEquipo,
    eliminarEquipo,
    verEquiposLigas
      
}
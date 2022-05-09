const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


// VER USUARIOS
function visualizarUsuarios(req, res) {

  if (req.user.rol !== "ROL_ADMIN") {

    return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
  }

  Usuarios.find( {rol:"ROL_USUARIO"}, (err, usuarioEncontrado) => {

    return res.status(200).send({usuarios: usuarioEncontrado});
    
  })
}


// FUNCION LOGIN
function login(req, res) {

    const parametros = req.body;

    Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {

      if (usuarioEncontrado) {

        bcrypt.compare(

          parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {

            if (verificacionPassword) {

              if (parametros.obtenerToken === "true") {

                return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });

              } else {

                usuarioEncontrado.password == undefined;
                return res.status(200).send({ Usuario: usuarioEncontrado });

              }

            } else {
              return res.status(500).send({ error: "La contraseña es incorrecta, intentelo de nuevo" });
            }
          }
        );
      } else {
        return res.status(404).send({error: "No posee un usuario, cree uno"});
      }
    }
    );
  }

// REGISTRAR AL USUARIO POR DEFECTO
function usuarioDefecto(req, res) {
    
    var usuariosModel = new Usuarios();

    usuariosModel.usuario = 'ADMIN';
    usuariosModel.rol = 'ROL_ADMIN';

    Usuarios.find((err, usuarioEncontrado) => {

        if (usuarioEncontrado.length == 0) {

            bcrypt.hash('deportes123', null, null, (err, paswordEncriptada) => {
                usuariosModel.password = paswordEncriptada;
            });

            usuariosModel.save();
        }
    })
  }

// REGISTRAR USUARIO
  function registrarUsuario(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
      return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
    }

    const usuarioModel = new Usuarios();
    const parametros = req.body;
  
    if (parametros.usuario && parametros.password) {
      usuarioModel.usuario = parametros.usuario;
      usuarioModel.password = parametros.password;
      usuarioModel.rol = "ROL_USUARIO";
  
      Usuarios.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {


        if (usuarioEncontrado.length == 0) {
          bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
              usuarioModel.password = passwordEncriptada;
  
              usuarioModel.save((err, usuarioGuardado) => {

                if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                if (!usuarioGuardado)
                  return res.status(500).send({ mensaje: "Error al crear el usuario" });
                return res.status(200).send({ Usuario: usuarioGuardado });
              });
            }
          );
        } else {
          return res.status(400).send({ mensaje: "El usuario ya esta utilizado, ingrese otro" });
        }   
    });
    }
  }

  // REGISTRAR NUEVO ADMINISTRADOR
  function registrarNuevoAdmin(req, res) {

    

    const parametro = req.body;
    const modeloUsuario = new Usuarios();
  
    if (parametro.usuario && parametro.password) {
      modeloUsuario.usuario = parametro.usuario;
      modeloUsuario.password = parametro.password;
      modeloUsuario.rol = "ROL_ADMIN";
  
      Usuarios.find({ usuario: parametro.usuario }, (err, usuarioEncontrado) => {

        if (usuarioEncontrado.length == 0) {

          bcrypt.hash(
            parametro.password, null, null,
            (err, passwordEncriptada) => {
              modeloUsuario.password = passwordEncriptada;
  
              modeloUsuario.save((err, usuarioGuardado) => {

                if (err) return res.status(500).send({ mensaje: "Error en la petición" });
                if (!usuarioGuardado)
                  return res.status(500).send({ mensaje: "Error al agregar usuario admin" });

                return res.status(200).send({ Usuario: usuarioGuardado });
              });
            }
          );

        } else {
          return res.status(500).send({ error: "El usuario ya esta usado" });
          
        } 
      }
      );
    } 
  }

  // EDITAR USUARIO
  function EditarUsuario(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
      return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
    }

    var idUser = req.params.idUsuario;
    var parametros = req.body;
  
    
    Usuarios.findOne({ _id: idUser }, (err, usuarioEncontrado) => {

      if (req.user.rol == "ROL_ADMIN") {

        if (usuarioEncontrado.rol !== "ROL_USUARIO") {

          return res.status(403).send({ mensaje: "No se pueden editar a los Administradores" });

      } else {
        
      

    
    Usuarios.findByIdAndUpdate(idUser, parametros,{ new: true },(err, editarUsuario) => {
      

        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

        if (!editarUsuario) return res.status(403).send({ mensaje: "Error al editar a los usuarios" });
  
        return res.status(200).send({ Usuario: editarUsuario });

      }
    
      
      
    
    );
      }
  }
  });
  }

  // ELIMINAR USUARIO
  function eliminarUsuarios(req, res) {

    if (req.user.rol !== "ROL_ADMIN") {
      return res.status(500).send({ mensaje: "Solo el administrador tiene permisos" });
    }

    var idUser = req.params.idUsuario;
  
    Usuarios.findOne({ _id: idUser }, (err, usuarioEncontrado) => {

      if (req.user.rol == "ROL_ADMIN") {
        if (usuarioEncontrado.rol !== "ROL_USUARIO") {

          return res.status(403).send({ mensaje: "No se pueden eliminar a los Administradores" });

        } else {
          Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
            if (err)return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioEliminado)
              return res.status(403).send({ mensaje: "Error al eliminar el cliente" });
  
            return res.status(200).send({ usuario: usuarioEliminado });
          });
        }
      }
    });
  }

  /* EDITAR Y ELIMINAR PERFILES */

  // EDITAR PERFIL
  function editarPerfil(req, res) {

    var datos = req.body;
  
  
    if (datos.usuario) {

      Usuarios.findByIdAndUpdate({ _id: req.user.sub }, datos, { new: true }, (error, nuevosParametros) => {

          if (error) return res.status(500).send({ error: "Ocurrio un error" });
          if (!nuevosParametros)
            return res.status(500).send({ Error: "El perfil no existe." });
          return res.status(200).send({ cliente: nuevosParametros });
        }
      );

    } else {
      return res.status(500).send({Error: "Debe llenar los campos (usuario)"});
    }
  }


  // ELIMINAR PERFIL
  function eliminarPerfil(req, res){


      var idPerfil = req.user.sub;

      Usuarios.findByIdAndDelete(idPerfil, (error, perfilEliminado) => {

        if (error) return res.status(500).send({ Error: "Error en la peticion." });

        if (!perfilEliminado)

          return res.status(500).send({ Error: "No existe el perfil" });

        return res.status(200).send({ cliente: perfilEliminado });

      });
}





module.exports ={
   usuarioDefecto,
   registrarUsuario,
   login,
   registrarNuevoAdmin,
   EditarUsuario,
   eliminarUsuarios,
   visualizarUsuarios,
   editarPerfil,
   eliminarPerfil
}



const Equipos = require("../models/equipo.model");
const Ligas = require("../models/ligas.model");


function generarReporte(req,res){
    var idUsuario;
  
    if(req.params.liga == null) return res.status(500).send({error: "debe enviar el nombre de que liga quiere generar su reporte"})
  
  
    if (req.user.rol == "ROL_USUARIO") {
  
        idUsuario = req.user.sub;
  
    } else if (req.user.rol == "ROL_ADMIN") {
      
        if (req.params.idUsuario == null) {
            return res.status(500).send({mensaje: "debe enviar el id del usuario al que quiere generar su reporte",
            });
        }
        idUsuario = req.params.idUsuario;
    }
  
    Ligas.findOne({nombre: req.params.liga, idUsuario: idUsuario}, (err, ligaEncontrada)=>{
        if(!ligaEncontrada){
            return res.status(500).send({ error: "no se encontró la liga" });
        }else{
            Equipos.find({idUsuario: idUsuario, idLiga: ligaEncontrada._id}, (err, equiposEncontrados)=>{
                if(equiposEncontrados.length==0) return res.status(500).send({ mensaje: "no cuenta con equipos en esta liga" });
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
  
  
                generarPdf(req.params.liga,equiposEncontrados)
                return res.status(200).send({mensaje: "pdf generado en la carpeta de archivosPdf"})
            }).sort({ puntos: -1})
        }
    })
  }


  function generarPdf(nombreLiga, equipos) {

  
    const fs = require('fs');
    const Pdfmake = require('pdfmake');
  
    fs.mkdir('./src/archivosPdf', { recursive: true }, (err) => {
      if (err) throw err;
    });
  
    var fonts = {
      Roboto: {
        normal: './src/fonts/roboto/Roboto-Regular.ttf',
        bold: './src/fonts/roboto/Roboto-Medium.ttf',
        italics: './src/fonts/roboto/Roboto-Italic.ttf',
        bolditalics: './src/fonts/roboto/Roboto-MediumItalic.ttf'
      }
    };
  
    let pdfmake = new Pdfmake(fonts);
  
    let content = [{
      text: 'Listado de equipos y datos: ' + nombreLiga,
      alignment: 'left',
      fontSize: 25,
      color: '#0000FF',
      bold: true,

      margin: [0, 0, 0, 20]
    }]
  
    var titulos = new Array('Posición', 'Equipo', 'Puntos', 'Partidos jugados', 'Goles a favor', 'Goles en contra', 'Diferencia de goles' );
  
    var body = []
  
    body.push(titulos)
  
    for (let i = 0; i < equipos.length ; i++) {
        var datosEquipos = new Array((i+1),equipos[i].nombreEquipo, equipos[i].puntos, equipos[i].cantidadJugados, 
        equipos[i].golesFavor, equipos[i].golesContra, equipos[i].diferenciaGoles)
        body.push(datosEquipos)
    }
  
    content.push({
        text: ' ',
        margin: [0, 0, 0, 10]
    })
  
  
    content.push({
      table: {		
        heights:60,
      headerRows: 1,
      widths: ['*','*', '*', '*', '*', '*', '*' ],
  
      body: body
  
    },
      margin: [0, 0, 0, 10]
    })
  
  
  let documento = {
      pageSize: {
          width: 594.28,
          height: 840.88  
        },
      content: content
  }
  
  let pdfDoc = pdfmake.createPdfKitDocument(documento, {});
  
  pdfDoc.pipe(fs.createWriteStream('./src/archivosPdf/datos de '+ nombreLiga.toLowerCase() +'.pdf'));
  
  
  pdfDoc.end();
  
  }

  module.exports = {
    generarReporte
  }




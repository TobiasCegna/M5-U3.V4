var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function(req, res, next) {
  
    var novedades = await novedadesModel.getNovedades();

    novedades = novedades.splice(0, 5);
    
    novedades = novedades.map(novedad => {
        if (novedad.img_id) {
            const imagen = cloudinary.url(novedad.img_id, {
                width: 460,
                crop: 'fill'
            });
            return {
                ...novedad,
                imagen
            }
        } else {
            return {
                ...novedad,
                imagen: '/img/noimage.jpg'
            }
        }
    });
    res.render('index', {
        novedades
    });
});

router.post('/', async(req, res, next) => {

      var nombre = req.body.nombre;
      var apellido = req.body.apellido;
      var email = req.body.email; 
      var tel = req.body.tel; 
      var mensaje = req.body.mensaje; 

      console.log(req.body)

      var obj = {
          to: 'tobiascegna@gmail.com',
          subject: 'CONTACTO WEB',
          html: nombre + "se contacto a traves de la web y quiere mas inforamcion a este correo : " + email + ". <br> Ademas, hizo este comentario : " + mensaje +  " . <br> su tel es: + tel"
      }

      var trasport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
          }
       });

       var info = await trasport.sendMail(obj);


       res.render('index', {
          message: 'Mensaje enviado correctamente'
       });
});


module.exports = router;



'use strict'

const { query } = require('express');
var validator = require('validator');
var fs = require('fs');
var path = require('path');
const article = require('../models/article');
var Article = require('../models/article');

var controller = {

    datosCurso: (req, res)=>{
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master Framework JS',
            autor: 'Yo que se',
            hola
        });
    },

    test: (req, res)=>{
        return res.status(200).send({
            message: ':v'
        });
    },

    save: (req, res)=>{
        // Obtener Parametros
        var params = req.body;
        // Validar Datos
        try{
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Datos requeridos no presente'
            });
        }

        if(validateTitle && validateContent){
            // Crear Objeto a guardar
            var article = new Article();

            // Asignando valores al objeto
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar Articulo
            article.save((err, articleStored) => {
                if(err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Ha ocurrido un error, Articulo no guardado'
                    });
                }else{
                    return res.status(200).send({
                        status: 'Succes',
                        article: articleStored
                    });
        
                }
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Datos no validos'
            });
        }
    },

    getArticles: (req, res)=>{
        // Find 
        var query = Article.find({});
        var last = req.params.last;
        
        if(last || last != undefined){
            query.limit(5);
        }

        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos disponibles'
                });
            }
            
            return res.status(200).send({
                status: 'succes',
                articles
            });
        });
    },

    getArticle: (req, res)=>{
        // Get ID
        var articleId = req.params.id;

        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'El articulo no existe'
            });
        }

        Article.findById(articleId, (err, article)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Se aha producido un error'
                });
            }

            if(!article){
                return res.status(404).send({
                    status: 'error',
                    message: 'E articulo no ha sido encontrado'
                });
            }

            return res.status(200).send({
                status: 'succes',
                article
            });

        });
        
    },

    update: (req, res)=>{
        var idArticle = req.params.id;
        var params = req.body;

        try{
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        }catch(Error){
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validateTitle || validateContent){
            Article.findOneAndUpdate({_id: idArticle}, params, {new:true}, (err, articleUbdated)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Ha ocurrido un error al actualizar'
                    });
                }
                if(!articleUbdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'El articulo no existe'
                    });
                }

                return res.status(200).send({
                    status: 'succes',
                    articleUbdated
                });
            });
        }else{
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

    },

    delete: (req, res)=>{
        var idArticle = req.params.id;

        Article.findOneAndDelete({_id: idArticle}, (err, articleRemove)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Ha ocurrido un error'
                });
            }

            if(!articleRemove){
                return res.status(200).send({
                    status: 'error',
                    message: 'El articulo no existe'
                });
            }

            return res.status(200).send({
                status: 'succes',
                articleRemove
            });

        });
    },

    upload: (req, res)=>{
        var idArticle = req.params.id;

        var file_name = 'Imagen no subida'

        if(!req.files){
            return res.status(404).status({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var extencion = file_name.split('.')[1];

        if(extencion != 'png' && extencion != 'jpg' && extencion != 'jpeg' && extencion != 'gif'){
            fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status: 'error',
                    message: 'La extencion de la imagen no es valida'
                });
            })
        }else{

            Article.findOneAndUpdate({_id: idArticle}, {image: file_name}, {new:true}, (err, articleUbdated)=>{

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Ha ocurrido un error al guardar la imagen'
                    });
                }
                if(!articleUbdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'El articulo no existe'
                    });
                }

                return res.status(200).send({
                    status: 'succes',
                    articleUbdated
                });
            })

           

        }
    }

}; // End Controller Article

module.exports = controller;
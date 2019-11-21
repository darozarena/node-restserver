const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

// fileUpload hace que todos los archivos que se carguen estén en req.files
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: { message: "No se ha seleccionado ningún archivo" }
        });
    }

    // Validar tipo
    let tiposValidos = ["productos", "usuarios"];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                tipo,
                message: "Los tipos permitidos son " + tiposValidos.join(", ")
            }
        });
    }

    // archivo es el nombre que se le pasa en el body de la petición
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ["png", "jpg", "jpeg", "gif"];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                ext: extension,
                message: "Las extensiones permitidas son " + extensionesValidas.join(", ")
            }
        });
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Actualizar imagen del usuario/producto
        switch (tipo) {
            case tiposValidos[0]:
                imagenProducto(id, res, nombreArchivo);
                break;
            case tiposValidos[1]:
                imagenUsuario(id, res, nombreArchivo);
                break;
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }
        borraArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioActualizado) => {
            res.json({
                ok: true,
                message: "Imagen de usuario actualizada"
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "productos");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, "productos");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }
        borraArchivo(productoDB.img, "productos");

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoActualizado) => {
            res.json({
                ok: true,
                message: "Imagen de producto actualizada"
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(
        __dirname,
        `../../uploads/${tipo}/${nombreImagen}`
    );

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
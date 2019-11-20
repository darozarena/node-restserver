const express = require("express");
const _ = require("underscore");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");
const { verificaToken } = require("../middlewares/autenticacion");

const app = express();

app.get("/productos", verificaToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;

    Producto.find({ disponible: true })
        .skip(from)
        .limit(limit)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {
                res.json({
                    ok: true,
                    productos,
                    total
                });
            });
        });
});

app.get("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = RegExp(termino, "i");
    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.put("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "nombre",
        "precioUni",
        "descripcion", ,
        "disponible",
        "categoria"
    ]);

    Producto.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        }
    );
});

app.post("/productos", verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiarEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(
        id,
        cambiarEstado, { new: true },
        (err, productoRemoved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoRemoved) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                message: "Producto Borrado"
            });
        }
    );
});

module.exports = app;
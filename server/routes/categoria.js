const express = require("express");
const Categoria = require("../models/categoria");
const {
    verificaToken,
    verificaAdminRole
} = require("../middlewares/autenticacion");

const app = express();

app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate("usuario", "nombre email")
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoría no encontrada"
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(
        id,
        descCategoria, { new: true, runValidators: true, context: "query" },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoría no encontrada"
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    );
});

app.post("/categoria", verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaRemoved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaRemoved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoría Borrada"
        });
    });
});

module.exports = app;
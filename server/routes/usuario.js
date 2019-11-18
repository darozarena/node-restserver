const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario");
const {
    verificaToken,
    verificaAdminRole
} = require("../middlewares/autenticacion");

const app = express();

app.get("/", (req, res) => {
    res.json("Hello World");
});

app.get("/usuario", verificaToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 0;

    Usuario.find({ estado: true }, "nombre email google")
        .skip(from)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            });
        });
});

app.post("/usuario", [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "role", "img", "estado"]);

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    );
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(
        id,
        cambiarEstado, { new: true },
        (err, usuarioRemoved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioRemoved
            });
        }
    );

    // Usuario.findByIdAndRemove(id, (err, usuarioRemoved) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioRemoved) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: "Usuario no encontrado"
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioRemoved
    //     });
    // });
});

module.exports = app;
var dashGeralModel = require("../models/dashGeralModel");

function setorMaisVisitado(req, res) {
    var idEmpresa = req.params.idEmpresa;

    dashGeralModel.setorMaisVisitado(idEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function setorMenosVisitado(req, res) {
    var idEmpresa = req.params.idEmpresa;

    dashGeralModel.setorMenosVisitado(idEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function filialMaisFluxo(req, res) {
    var idEmpresa = req.params.idEmpresa;

    dashGeralModel.filialMaisFluxo(idEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function filialMenosFluxo(req, res) {
    var idEmpresa = req.params.idEmpresa;
    
    dashGeralModel.filialMenosFluxo(idEmpresa)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    setorMaisVisitado,
    setorMenosVisitado,
    filialMaisFluxo,
    filialMenosFluxo
};
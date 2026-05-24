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
function buscarFluxoSemanal(req, res) {
    var idEmpresa = req.params.idEmpresa;
 
    dashGeralModel.buscarFluxoSemanal(idEmpresa)
        .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}
 
function buscarFluxoPorSetor(req, res) {
    var idEmpresa = req.params.idEmpresa;
 
    dashGeralModel.buscarFluxoPorSetor(idEmpresa)
        .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}
 
function buscarTotalPorFilial(req, res) {
    var idEmpresa = req.params.idEmpresa;
 
    dashGeralModel.buscarTotalPorFilial(idEmpresa)
        .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    setorMaisVisitado,
    setorMenosVisitado,
    filialMaisFluxo,
    filialMenosFluxo,
    buscarFluxoSemanal,
    buscarFluxoPorSetor,
    buscarTotalPorFilial
};
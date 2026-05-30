var ObterDadosEspecificaModel = require("../models/ObterDadosEspecificaModel");

function buscarDadosFluxo(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarDadosFluxo(idFilial)
        .then(function (resultadoBuscaFluxo) {
            res.json(resultadoBuscaFluxo);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarDadosFluxoAcumulado(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarDadosFluxoAcumulado(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarDadosFluxoSemana(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarDadosFluxoSemana(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarDadosHeatmap(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarDadosHeatmap(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarMeta(req, res) {
    let idFilial = req.params.idFilial;
    let metaFilial = String(req.body.metaFilial);

    var numerosValidos = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    var valido = true;

    if (metaFilial == "" || metaFilial == "undefined") {
        return res.status(400).json("Meta inválida, insira um valor!");
    }

    for (var i = 0; i < metaFilial.length; i++) {
        if (numerosValidos.indexOf(metaFilial[i]) == -1) {
            valido = false;
        }
    }

    if (!valido) {
        return res.status(400).json("Meta inválida, insira apenas números!");
    }

    ObterDadosEspecificaModel.atualizarMeta(idFilial, metaFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function BuscarFluxoMax(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.BuscarFluxoMax(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function BuscarFluxoMin(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.BuscarFluxoMin(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarPicoHora(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarPicoHora(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function ComparacaoFluxo(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.ComparacaoFluxo(idFilial)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarFiliais(req, res) {
    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarFiliais(idFilial)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                ObterDadosEspecificaModel.buscarFiliais2(idFilial)
                    .then(function (resultado) {
                        res.json(resultado);
                    })
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarDadosFluxo,
    buscarDadosFluxoSemana,
    buscarDadosFluxoAcumulado,
    buscarDadosHeatmap,
    atualizarMeta,
    BuscarFluxoMax,
    BuscarFluxoMin,
    buscarPicoHora,
    ComparacaoFluxo,
    buscarFiliais
}
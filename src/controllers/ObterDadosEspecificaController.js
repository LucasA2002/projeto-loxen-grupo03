var ObterDadosEspecificaModel = require("../models/ObterDadosEspecificaModel");

function buscarDadosFluxo(req, res) {

    let idFilial = req.params.idFilial;

    ObterDadosEspecificaModel.buscarDadosFluxo(idFilial)
        .then(
            function (resultadoBuscaFluxo) {
                res.json(resultadoBuscaFluxo);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao buscar dados! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    buscarDadosFluxo
}
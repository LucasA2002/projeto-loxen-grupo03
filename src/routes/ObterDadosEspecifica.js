var express = require("express");
var router = express.Router();

var ObterDadosEspecifica = require("../controllers/ObterDadosEspecificaController");

router.get("/buscarDadosFluxo/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarDadosFluxo(req, res);
});

router.put("/atualizarMeta/:idFilial", function (req, res) {
    ObterDadosEspecifica.atualizarMeta(req, res);
});

router.get("/buscarDadosFluxoAcumulado/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarDadosFluxoAcumulado(req, res);
});

router.get("/buscarDadosFluxoSemana/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarDadosFluxoSemana(req, res);
});

router.get("/buscarDadosHeatmap/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarDadosHeatmap(req, res);
});

module.exports = router;
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

router.get("/buscarMaisVisitado/:idFilial", function (req, res) {
    ObterDadosEspecifica.BuscarFluxoMax(req, res);
});

router.get("/buscarMenosVisitado/:idFilial", function (req, res) {
    ObterDadosEspecifica.BuscarFluxoMin(req, res);
});

router.get("/buscarPicoHora/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarPicoHora(req, res);
});

router.get("/ComparacaoFluxo/:idFilial", function (req, res) {
    ObterDadosEspecifica.ComparacaoFluxo(req, res);
});

module.exports = router;
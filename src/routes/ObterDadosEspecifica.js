var express = require("express");
var router = express.Router();

var ObterDadosEspecifica = require("../controllers/ObterDadosEspecificaController");

router.get("/buscarDadosFluxo/:idFilial", function (req, res) {
    ObterDadosEspecifica.buscarDadosFluxo(req, res);
});

module.exports = router;
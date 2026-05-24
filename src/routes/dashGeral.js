var express = require("express");
var router = express.Router();

var dashGeralController = require("../controllers/dashGeralController");

router.get("/setorMaisVisitado/:idEmpresa", function (req, res) {
    dashGeralController.setorMaisVisitado(req, res);
});

router.get("/setorMenosVisitado/:idEmpresa", function (req, res) {
    dashGeralController.setorMenosVisitado(req, res);
});

router.get("/filialMaisFluxo/:idEmpresa", function (req, res) {
    dashGeralController.filialMaisFluxo(req, res);
});

router.get("/filialMenosFluxo/:idEmpresa", function (req, res) {
    dashGeralController.filialMenosFluxo(req, res);
});

module.exports = router;
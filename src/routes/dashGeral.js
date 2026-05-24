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
router.get("/fluxoSemanal/:idEmpresa", function (req, res) {
    dashGeralController.buscarFluxoSemanal(req, res);
});
 
router.get("/fluxoSetor/:idEmpresa", function (req, res) {
    dashGeralController.buscarFluxoPorSetor(req, res);
});
 
router.get("/fluxoFilial/:idEmpresa", function (req, res) {
    dashGeralController.buscarTotalPorFilial(req, res);
});

module.exports = router;
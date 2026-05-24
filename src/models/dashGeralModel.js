var database = require("../database/config")

function setorMaisVisitado(idEmpresa) {
    var instrucaoSql = `
        SELECT s.setor, SUM(m.presenca) AS total
        FROM monitoramento m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor s ON s.idSetor = sensor.fkSetor
        JOIN filial f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
        AND MONTH(m.data_hora) = MONTH(CURDATE())
        AND YEAR(m.data_hora) = YEAR(CURDATE())
        GROUP BY s.setor
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function setorMenosVisitado(idEmpresa) {
    var instrucaoSql = `
        SELECT s.setor, SUM(m.presenca) AS total
        FROM monitoramento m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor s ON s.idSetor = sensor.fkSetor
        JOIN filial f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
        AND MONTH(m.data_hora) = MONTH(CURDATE())
        AND YEAR(m.data_hora) = YEAR(CURDATE())
        GROUP BY s.setor
        ORDER BY total ASC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function filialMaisFluxo(idEmpresa) {
    var instrucaoSql = `
        SELECT f.nome, SUM(m.presenca) AS total
        FROM monitoramento m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor s ON s.idSetor = sensor.fkSetor
        JOIN filial f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
        AND MONTH(m.data_hora) = MONTH(CURDATE())
        AND YEAR(m.data_hora) = YEAR(CURDATE())
        GROUP BY f.nome
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function filialMenosFluxo(idEmpresa) {
    var instrucaoSql = `
        SELECT f.nome, SUM(m.presenca) AS total
        FROM monitoramento m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor s ON s.idSetor = sensor.fkSetor
        JOIN filial f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
        AND MONTH(m.data_hora) = MONTH(CURDATE())
        AND YEAR(m.data_hora) = YEAR(CURDATE())
        GROUP BY f.nome
        ORDER BY total ASC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    setorMaisVisitado,
    setorMenosVisitado,
    filialMaisFluxo,
    filialMenosFluxo
};
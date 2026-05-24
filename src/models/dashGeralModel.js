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

function buscarFluxoSemanal(idEmpresa){
    var instrucaoSql = `SELECT
        DAYNAME(m.data_hora) AS dia_semana,
        ROUND(COUNT(m.idMonitoramento) / 4, 0) AS media
        FROM monitoramento as m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial AS f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
            AND MONTH(m.data_hora) = MONTH(CURRENT_DATE())
            AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
        GROUP BY DAYNAME(m.data_hora)`
    console.log("Executando a instrução SQL: \n" + instrucaoSQL)
    return database.executar(instrucaoSql)
}

function buscarFluxoPorSetor(idEmpresa){
    var instrucaoSql = `SELECT
        s.setor AS nome_setor, 
        ROUND(COUNT(m.idMonitoramento) / COUNT(f.idFilial), 0) AS media
        FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial AS f ON f.idFilial = s.fkFilial
        WHERE f.fkEmpresa = ${idEmpresa}
            AND WEEK(m.data_hora) = WEEK(CURRENT_DATE())
            AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
        GROUP BY s.setor
        ORDER BY media DESC;`
    console.log("Executando a instrução SQL: \n" + instrucaoSQL)
    return database.executar(instrucaoSql)
}
function buscarTotalPorFilial(idEmpresa){
    var instrucaoSql = `SELECT
    f.nome AS nome_filial,
    COUNT(m.idMonitoramento) AS total
    FROM monitoramento AS m
    JOIN sensor ON sensor.idSensor = m.fkSensor
    JOIN setor AS s ON s.idSetor = sensor.fkSetor
    JOIN filial AS f ON f.idFilial = s.fkFilial
    WHERE f.fkEmpresa = ${idEmpresa}
        AND MONTH(m.data_hora) = MONTH(CURRENT_DATE())
        AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
        GROUP BY f.idFilial, f.nome
        ORDER BY total DESC;`
    console.log("Executando a instrução SQL: \n" + instrucaoSQL)
    return database.executar(instrucaoSql)
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
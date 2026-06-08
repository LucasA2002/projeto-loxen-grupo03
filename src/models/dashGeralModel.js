var database = require("../database/config")

function setorMaisVisitado(idEmpresa) {
    var instrucaoSql = `
        SELECT setor, mes, COUNT(idMonitoramento) AS total
        FROM vw_fluxo_por_setor
        WHERE fkEmpresa = ${idEmpresa}
        AND MONTH(data_hora) = MONTH(CURDATE())
        AND YEAR(data_hora) = YEAR(CURDATE())
        GROUP BY setor, mes
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function setorMenosVisitado(idEmpresa) {
    var instrucaoSql = `
        SELECT setor, mes, COUNT(idMonitoramento) AS total
        FROM vw_fluxo_por_setor
        WHERE fkEmpresa = ${idEmpresa}
        AND MONTH(data_hora) = MONTH(CURDATE())
        AND YEAR(data_hora) = YEAR(CURDATE())
        GROUP BY setor, mes
        ORDER BY total ASC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function filialMaisFluxo(idEmpresa) {
    var instrucaoSql = `
        SELECT nome, mes, COUNT(idMonitoramento) AS total
        FROM vw_fluxo_por_filial
        WHERE fkEmpresa = ${idEmpresa}
        AND MONTH(data_hora) = MONTH(CURDATE())
        AND YEAR(data_hora) = YEAR(CURDATE())
        GROUP BY nome, mes
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function filialMenosFluxo(idEmpresa) {
      var instrucaoSql = `
        SELECT nome, mes, COUNT(idMonitoramento) AS total
        FROM vw_fluxo_por_filial
        WHERE fkEmpresa = ${idEmpresa}
        AND MONTH(data_hora) = MONTH(CURDATE())
        AND YEAR(data_hora) = YEAR(CURDATE())
        GROUP BY nome, mes
        ORDER BY total ASC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarFluxoSemanal(idEmpresa) {
    var instrucaoSql = `
        SELECT
            dia_semana, mes,
            ROUND(COUNT(idMonitoramento) / 4, 0) AS media
        FROM vw_fluxo_semanal_empresa
        WHERE fkEmpresa = ${idEmpresa}
            AND MONTH(data_hora) = MONTH(CURRENT_DATE())
            AND YEAR(data_hora) = YEAR(CURRENT_DATE())
        GROUP BY dia_semana, mes;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFluxoPorSetor(idEmpresa) {
    var instrucaoSql = `
        SELECT
            setor AS nome_setor, mes,
            ROUND(COUNT(idMonitoramento) / COUNT(DISTINCT idFilial), 0) AS media
        FROM vw_fluxo_setor_empresa
        WHERE fkEmpresa = ${idEmpresa}
            AND MONTH(data_hora) = MONTH(CURRENT_DATE())
            AND YEAR(data_hora) = YEAR(CURRENT_DATE())
        GROUP BY setor, mes
        ORDER BY media DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTotalPorFilial(idEmpresa) {
    var instrucaoSql = `
        SELECT
            nome_filial, mes,
            COUNT(idMonitoramento) AS total
        FROM vw_fluxo_filial_empresa
        WHERE fkEmpresa = ${idEmpresa}
            AND MONTH(data_hora) = MONTH(CURRENT_DATE())
            AND YEAR(data_hora) = YEAR(CURRENT_DATE())
        GROUP BY idFilial, nome_filial, mes
        ORDER BY total DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
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
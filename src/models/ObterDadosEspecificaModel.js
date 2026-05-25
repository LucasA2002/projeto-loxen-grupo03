var database = require("../database/config")

function buscarDadosFluxo(idFilial) {
    var instrucaoSql = `
        SELECT 
            CASE mes
                WHEN 1 THEN 'Janeiro'
                WHEN 2 THEN 'Fevereiro'
                WHEN 3 THEN 'Março'
                WHEN 4 THEN 'Abril'
                WHEN 5 THEN 'Maio'
                WHEN 6 THEN 'Junho'
                WHEN 7 THEN 'Julho'
                WHEN 8 THEN 'Agosto'
                WHEN 9 THEN 'Setembro'
                WHEN 10 THEN 'Outubro'
                WHEN 11 THEN 'Novembro'
                WHEN 12 THEN 'Dezembro'
            END AS mes,
            CASE dia_semana
                WHEN 1 THEN 'Domingo'
                WHEN 2 THEN 'Segunda-feira'
                WHEN 3 THEN 'Terça-feira'
                WHEN 4 THEN 'Quarta-feira'
                WHEN 5 THEN 'Quinta-feira'
                WHEN 6 THEN 'Sexta-feira'
                WHEN 7 THEN 'Sábado'
            END AS diaSemana,
        SUM(total_dia) AS totalPessoas,
        SUM(total_dia) / 4 AS mediaPorDiaSemana,
        metaFilial AS metaFilial
        FROM (
            SELECT 
                MONTH(m.data_hora) AS mes,
                DAYOFWEEK(m.data_hora) AS dia_semana,
                DATE(m.data_hora) AS data,
                COUNT(m.idMonitoramento) AS total_dia,
                filial.metaFilial AS metaFilial
            FROM monitoramento AS m
            JOIN sensor ON sensor.idSensor = m.fkSensor
            JOIN setor ON setor.idSetor = sensor.fkSetor
            JOIN filial ON filial.idFilial = setor.fkFilial
            WHERE MONTH(m.data_hora) = MONTH(CURRENT_DATE())
            AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
            AND filial.idFilial = ${idFilial}
            GROUP BY MONTH(m.data_hora), DAYOFWEEK(m.data_hora), DATE(m.data_hora), filial.metaFilial
        ) AS sub
        GROUP BY mes, dia_semana
        ORDER BY dia_semana;
        `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosFluxoAcumulado(idFilial) {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(data_hora, '%d/%m/%Y') AS dia,
            HOUR(data_hora) AS hora,
            COUNT(idMonitoramento) AS totalPessoas
        FROM monitoramento
            JOIN sensor ON sensor.idSensor = monitoramento.fkSensor
            JOIN setor ON setor.idSetor = sensor.fkSetor
            JOIN filial ON filial.idFilial = setor.fkFilial
            WHERE DATEDIFF(CURRENT_DATE(), DATE(data_hora)) = 1
            AND filial.idFilial = ${idFilial}
        GROUP BY hora, dia
        ORDER BY hora;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosHeatmap(idFilial) {
    var instrucaoSql = `
        SELECT 
            sensor.idSensor,
            COUNT(m.idMonitoramento) AS totalPessoas
        FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor ON setor.idSetor = sensor.fkSetor
        JOIN filial ON filial.idFilial = setor.fkFilial
        WHERE DATE(m.data_hora) = CURRENT_DATE()
        AND filial.idFilial = ${idFilial}
        GROUP BY sensor.idSensor
        ORDER BY sensor.idSensor;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosFluxoSemana(idFilial) {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(m.data_hora, '%d/%m') AS dataFormatada,
            s.setor AS setor,
            COUNT(m.idMonitoramento) AS totalPessoas,
            DATE(m.data_hora) as dia
        FROM monitoramento AS m
            JOIN sensor ON sensor.idSensor = m.fkSensor
            JOIN setor AS s ON s.idSetor = sensor.fkSetor
            JOIN filial ON filial.idFilial = s.fkFilial
            WHERE DATEDIFF(CURRENT_DATE(), DATE(m.data_hora)) BETWEEN 0 AND 6
            AND filial.idFilial = ${idFilial}
        GROUP BY DATE(m.data_hora), dataFormatada, s.setor, dia
        ORDER BY DATE(m.data_hora), s.setor;                           
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarMeta(idFilial, metaFilial) {
    var instrucaoSql = `
        UPDATE filial
        SET metaFilial = ${metaFilial}
        WHERE idFilial = ${idFilial};
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosFluxo,
    buscarDadosFluxoAcumulado,
    buscarDadosFluxoSemana,
    buscarDadosHeatmap,
    atualizarMeta
};
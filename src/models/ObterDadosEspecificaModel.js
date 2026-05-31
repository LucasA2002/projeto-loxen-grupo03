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
            setor.setor AS nomeSetor,
            COUNT(m.idMonitoramento) AS totalPessoas
        FROM sensor
            JOIN setor ON setor.idSetor = sensor.fkSetor
            JOIN filial ON filial.idFilial = setor.fkFilial
            LEFT JOIN monitoramento AS m ON m.fkSensor = sensor.idSensor 
            AND DATE(m.data_hora) = CURRENT_DATE()
        WHERE filial.idFilial = ${idFilial}
        GROUP BY sensor.idSensor, setor.setor
        ORDER BY sensor.idSensor;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarNomeSetorPorSensor(idSensor) {
    var instrucaoSql = `
        SELECT setor.setor AS nomeSetor
        FROM sensor
        JOIN setor ON setor.idSetor = sensor.fkSetor
        WHERE sensor.idSensor = ${idSensor};
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

function BuscarFluxoMax(idFilial) {
    var instrucaoSql = `
        SELECT 
            s.setor AS setor,
            COUNT(m.idMonitoramento) AS maxPessoas,
            CASE MONTH(m.data_hora)
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
            END AS mes
        FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial ON filial.idFilial = s.fkFilial
        WHERE DATEDIFF(CURRENT_DATE(), DATE(m.data_hora)) BETWEEN 0 AND 31
        AND filial.idFilial = ${idFilial}
        GROUP BY mes, DATE_FORMAT(m.data_hora, '%d/%m'), s.setor  
        ORDER BY maxPessoas DESC
        LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function BuscarFluxoMin(idFilial) {
    var instrucaoSql = `
        SELECT 
            s.setor AS setor,
            COUNT(m.idMonitoramento) AS minPessoas,
            CASE MONTH(m.data_hora)
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
            END AS mes
        FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial ON filial.idFilial = s.fkFilial
        WHERE DATEDIFF(CURRENT_DATE(), DATE(m.data_hora)) BETWEEN 0 AND 31
        AND filial.idFilial = ${idFilial}
        GROUP BY mes, DATE_FORMAT(m.data_hora, '%d/%m'), s.setor  
        LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPicoHora(idFilial) {
    var instrucaoSql = `
        SELECT 
		    HOUR(data_hora) AS hora,
		    DATE_FORMAT(data_hora, '%d/%m/%Y') AS ontem,
		    COUNT(idMonitoramento) AS totalPessoas
	    FROM monitoramento
	    	JOIN sensor ON sensor.idSensor = monitoramento.fkSensor
	    	JOIN setor ON setor.idSetor = sensor.fkSetor
	    	JOIN filial ON filial.idFilial = setor.fkFilial
	    	WHERE DATEDIFF(CURRENT_DATE(), DATE(data_hora)) = 1
	    	AND filial.idFilial = ${idFilial}
	    GROUP BY hora, ontem
	    ORDER BY totalPessoas DESC
        LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ComparacaoFluxo(idFilial) {
    var instrucaoSql = `
            SELECT 
                COUNT(m.idMonitoramento) AS totalPessoas,
                CASE MONTH(m.data_hora)
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
                END AS mes
            FROM monitoramento AS m
                JOIN sensor ON sensor.idSensor = m.fkSensor
                JOIN setor ON setor.idSetor = sensor.fkSetor
                JOIN filial ON filial.idFilial = setor.fkFilial
            WHERE filial.idFilial = ${idFilial}
            GROUP BY mes, MONTH(m.data_hora)
            ORDER BY MONTH(m.data_hora) DESC
            LIMIT 2;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFiliais(idFilial) {
    var instrucaoSql = `
        SELECT f.nome, f.idFilial AS novoIdFilial FROM filial f
	        JOIN filial m ON m.idfilial = f.fkMatriz
            LEFT JOIN usuario u ON f.idFilial = u.fkFilial
            WHERE f.fkMatriz = (
		        SELECT fSub.fkMatriz FROM filial fSub
			        WHERE fSub.idFilial = ${idFilial}
        )
        AND f.idFilial != ${idFilial};
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFiliais2(idFilial) {
    var instrucaoSql = `
        SELECT f.nome, f.idFilial AS novoIdFilial FROM filial f
	        JOIN filial m ON m.idfilial = f.fkMatriz
            WHERE f.fkMatriz = ${idFilial};
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function BuscarNomeIdMatriz(idFilial) {
    var instrucaoSql = `
       SELECT f.nome, IFNULL(f.fkMatriz, ${idFilial}) AS idMatriz 
	        FROM filial f
            LEFT JOIN filial m ON m.idFilial = f.fkMatriz
            WHERE f.idFilial = ${idFilial};
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosFluxo,
    buscarDadosFluxoAcumulado,
    buscarDadosFluxoSemana,
    buscarDadosHeatmap,
    buscarNomeSetorPorSensor,
    atualizarMeta,
    BuscarFluxoMax,
    BuscarFluxoMin,
    buscarPicoHora,
    ComparacaoFluxo,
    buscarFiliais,
    buscarFiliais2,
    BuscarNomeIdMatriz
};
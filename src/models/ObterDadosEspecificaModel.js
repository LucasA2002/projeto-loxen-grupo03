var database = require("../database/config")

function buscarDadosFluxo(idFilial) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscarDadosFluxo():", idFilial);

    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
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
                SUM(m.presenca) AS total_dia,
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

module.exports = {
    buscarDadosFluxo
};
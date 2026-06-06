var database = require("../database/config")

function buscarDadosFluxo(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_media_semanal
            WHERE idFilial = ${idFilial}
            ORDER BY diaSemana;
        `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosFluxoAcumulado(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_fluxo_acumulado
            WHERE idFilial = ${idFilial}
            ORDER BY hora;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosHeatmap(idFilial) {
    var instrucaoSql = `
        SELECT *
        FROM vw_heatmap
        WHERE idFilial = ${idFilial}
        ORDER BY idSensor;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarNomeSetorPorSensor(idSensor) {
    var instrucaoSql = `
        SELECT *
            FROM vw_sensor_setor
            WHERE idSensor = ${idSensor};
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosFluxoSemana(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_fluxo_semana
            WHERE idFilial = ${idFilial}
            ORDER BY dia, setor;
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
        SELECT *
            FROM vw_fluxo_max_min
            WHERE idFilial = ${idFilial}
            ORDER BY qtdPessoas DESC
            LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function BuscarFluxoMin(idFilial) {
    var instrucaoSql = `
            SELECT *
                FROM vw_fluxo_max_min
                WHERE idFilial = ${idFilial}
                LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPicoHora(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_pico_hora
            WHERE idFilial = ${idFilial}
            ORDER BY totalPessoas DESC
            LIMIT 1;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ComparacaoFluxo(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_comparacao_fluxo
            WHERE idFilial = ${idFilial}
            ORDER BY numeroMes DESC
            LIMIT 2;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFiliais(idFilial) {
    var instrucaoSql = `
        SELECT *
            FROM vw_filiais
                WHERE fkMatriz = (
                    SELECT fkMatriz
                    FROM filial
                    WHERE idFilial = ${idFilial}
                )
                AND novoIdFilial != ${idFilial}
                ORDER BY nome;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarFiliais2(idFilial) {
    var instrucaoSql = `
        SELECT *
                FROM vw_filiais2
                WHERE fkMatriz = ${idFilial}
                ORDER BY nome;
    `;
    console.log("Executando instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function BuscarNomeIdMatriz(idFilial) {
    var instrucaoSql = `
       SELECT
            nome,
            IFNULL(fkMatriz, idFilial) AS idMatriz
        FROM vw_nome_matriz
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
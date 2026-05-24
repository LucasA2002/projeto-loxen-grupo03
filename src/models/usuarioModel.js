var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT u.idFuncionario, u.nome, u.cargo, u.email, u.fkFilial, f.fkEmpresa
        FROM usuario u
        JOIN filial f ON f.idFilial = u.fkFilial
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, cargo, email, senha, codigo) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, cargo, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario(nome, cargo, email, senha, fkFilial)
    VALUES('${nome}', '${cargo}', '${email}', '${senha}', (SELECT idFilial FROM filial WHERE codigo = '${codigo}'));
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarFilial(nome, cnpj, logradouro, cidade, estado, cep, fkFilial) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, cnpj, logradouro, cidade, estado, cep);
    
    let codigo = Math.floor(10000 + Math.random() * 90000);

    var instrucaoSql = `
        INSERT INTO filial(codigo, nome, cnpj, logradouro, cidade, estado, cep, fkEmpresa, fkMatriz)
    VALUES(
        '${codigo}',
        '${nome}',
        '${cnpj}',
        '${logradouro}',
        '${cidade}',
        '${estado}',
        '${cep}',
        (SELECT fkEmpresa FROM(SELECT fkEmpresa FROM filial WHERE idFilial = '${fkFilial}') AS temp),
        '${fkFilial}'
        );
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql); 

    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarFilial
};
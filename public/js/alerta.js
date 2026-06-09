let filaAlertas = [];
let indiceAtual = 0;
let alertaVisivel = false;
let ultimoFluxoPorSetor = {};
let setoresConhecidos = [];

function verificarAlertasSemana(dadosFluxoSemana) {
    if (dadosFluxoSemana === undefined || dadosFluxoSemana.length === 0) {
        return;
    }

    let datas = [];
    for (let i = 0; i < dadosFluxoSemana.length; i++) {
        if (datas.indexOf(dadosFluxoSemana[i].dataFormatada) === -1) {
            datas.push(dadosFluxoSemana[i].dataFormatada);
        }
    }

    let diaRecente = datas[datas.length - 1];

    let setoresPresentes = [];

    for (let i = 0; i < dadosFluxoSemana.length; i++) {
        let item = dadosFluxoSemana[i];

        if (item.dataFormatada === diaRecente) {
            let setor = item.setor;
            let totalAtual = item.totalPessoas;

            setoresPresentes.push(setor);

            if (ultimoFluxoPorSetor[setor] === undefined) {
                ultimoFluxoPorSetor[setor] = {
                    total: totalAtual,
                    ultimaMudanca: Date.now(),
                    alertaDisparado: false
                };

                setoresConhecidos.push(setor);

            } else {
                let registro = ultimoFluxoPorSetor[setor];

                if (totalAtual !== registro.total) {
                    registro.total = totalAtual;
                    registro.ultimaMudanca = Date.now();
                    registro.alertaDisparado = true;
                } else {
                    let minutosSemMudanca = (Date.now() - registro.ultimaMudanca) / 60000;
                    console.log(`[${setor}] Sem mudança há ${minutosSemMudanca.toFixed(2)} min`);

                    if (minutosSemMudanca >= 0.2 && !registro.alertaDisparado) {
                        registro.alertaDisparado = true;
                        enfileirarAlerta(
                            'semMovimento',
                            'Setor sem movimento',
                            'O setor <b>' + setor + '</b> está sem registros há mais de 30 minutos.'
                        );
                    }
                }
            }
        }
    }

    for (let i = 0; i < setoresConhecidos.length; i++) {
        let setor = setoresConhecidos[i];
        if (setoresPresentes.indexOf(setor) === -1) {
            console.log(`[${setor}] Não veio na resposta, pausando timer`);
        }
    }

    if (filaAlertas.length === 0 && !alertaVisivel) {
        let todosBloqueados = true;

        for (let i = 0; i < setoresConhecidos.length; i++) {
            if (!ultimoFluxoPorSetor[setoresConhecidos[i]].alertaDisparado) {
                todosBloqueados = false;
                break;
            }
        }

        if (todosBloqueados) {
            for (let i = 0; i < setoresConhecidos.length; i++) {
                ultimoFluxoPorSetor[setoresConhecidos[i]].alertaDisparado = false;
                ultimoFluxoPorSetor[setoresConhecidos[i]].ultimaMudanca = Date.now();
            }
        }
    }

}

function enfileirarAlerta(tipo, titulo, mensagem) {
    filaAlertas.push({ tipo: tipo, titulo: titulo, mensagem: mensagem });
    if (!alertaVisivel) {
        exibirProximoAlerta();
    }
}

function exibirProximoAlerta() {
    if (indiceAtual >= filaAlertas.length) {
        alertaVisivel = false;
        filaAlertas = [];
        indiceAtual = 0;

        for (var i = 0; i < setoresConhecidos.length; i++) {
            ultimoFluxoPorSetor[setoresConhecidos[i]].alertaDisparado = false;
            ultimoFluxoPorSetor[setoresConhecidos[i]].teveAtividade = false;
            ultimoFluxoPorSetor[setoresConhecidos[i]].ultimaMudanca = Date.now();
        }

        return;
    }

    alertaVisivel = true;
    let alerta = filaAlertas[indiceAtual];
    indiceAtual++;

    document.getElementById('popUpAlerta').classList.remove('popUp-sem-movimento', 'ativo');
    document.getElementById('popUpTitulo').innerHTML = alerta.titulo;
    document.getElementById('popUpMensagem').innerHTML = alerta.mensagem;
    document.getElementById('popUpAlerta').classList.add('popUp-sem-movimento');

    setTimeout(function () {
        document.getElementById('popUpAlerta').classList.add('ativo');
    }, 50);
}

function fecharPopUp() {
    document.getElementById('popUpAlerta').classList.remove('ativo');

    setTimeout(function () {
        exibirProximoAlerta();
    }, 450);
}
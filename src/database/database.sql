CREATE DATABASE Loxen;
USE Loxen;

-- CRIAÇÃO DAS TABELAS
CREATE TABLE empresa(
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR (45),
status_empresa VARCHAR (7)
CHECK (status_empresa IN('Ativa', 'Inativa'))
);

CREATE TABLE filial(
idFilial INT PRIMARY KEY AUTO_INCREMENT,
codigo INT,
nome VARCHAR(45),
cnpj CHAR (19),
logradouro VARCHAR (45),
cidade VARCHAR (40),
estado VARCHAR (45),
cep VARCHAR (9),
status_loja VARCHAR (7) DEFAULT 'Ativa',
metaFilial DECIMAL(6, 2) DEFAULT NULL,
CHECK (status_loja IN('Ativa', 'Inativa')),
fkEmpresa INT,
CONSTRAINT FkEmpresa_const
FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa),
fkMatriz INT,
CONSTRAINT fkFilial_Matriz
FOREIGN KEY (fkMatriz) REFERENCES filial(idFilial)
);

CREATE TABLE usuario (
idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR (45),
cargo VARCHAR (45),
email VARCHAR (45),
senha VARCHAR (45),
fkFilial INT,
CONSTRAINT chFkFilial 
FOREIGN KEY (fkFilial) REFERENCES filial (idFilial),
CONSTRAINT chCargo 
CHECK (cargo IN('Administrador', 'Gerente', 'Funcionario', 'Suporte'))
);

CREATE TABLE setor (
idSetor INT PRIMARY KEY AUTO_INCREMENT,
setor VARCHAR (45),
fkFilial INT,
CONSTRAINT chFkFilialSetor
FOREIGN KEY (fkFilial) REFERENCES filial(idFilial)
);

CREATE TABLE sensor(
idSensor INT PRIMARY KEY AUTO_INCREMENT,
status_sensor VARCHAR (20),
fkSetor INT,
CONSTRAINT chFkSetor
FOREIGN KEY (fkSetor) REFERENCES setor (idSetor)
);

CREATE TABLE monitoramento(
idMonitoramento INT PRIMARY KEY AUTO_INCREMENT,
data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
fkSensor INT,
CONSTRAINT chFkSensor
FOREIGN KEY (fkSensor) REFERENCES sensor (idSensor)
);

-- Views DashBoard específica 

-- Média semanal do fluxo no mês atual, usada no gráfico de média por dia da semana.
CREATE VIEW vw_media_semanal AS
SELECT
    sub.idFilial,
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
    SUM(total_dia)/4 AS mediaPorDiaSemana,
    metaFilial
FROM (
    SELECT
        filial.idFilial,
        MONTH(m.data_hora) AS mes,
        DAYOFWEEK(m.data_hora) AS dia_semana,
        DATE(m.data_hora) AS data,
        COUNT(m.idMonitoramento) AS total_dia,
        filial.metaFilial
    FROM monitoramento m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor ON setor.idSetor = sensor.fkSetor
        JOIN filial ON filial.idFilial = setor.fkFilial
    WHERE MONTH(m.data_hora) = MONTH(CURRENT_DATE())
    AND YEAR(m.data_hora) = YEAR(CURRENT_DATE())
    GROUP BY
        filial.idFilial,
        MONTH(m.data_hora),
        DAYOFWEEK(m.data_hora),
        DATE(m.data_hora),
        filial.metaFilial
) sub
GROUP BY idFilial, mes, dia_semana, metaFilial;

-- Fluxo acumulado por hora do dia anterior.
CREATE VIEW vw_fluxo_acumulado AS
SELECT 
    filial.idFilial,
    DATE_FORMAT(data_hora, '%d/%m/%Y') AS dia,
    HOUR(data_hora) AS hora,
    COUNT(idMonitoramento) AS totalPessoas
FROM monitoramento
JOIN sensor ON sensor.idSensor = monitoramento.fkSensor
JOIN setor ON setor.idSetor = sensor.fkSetor
JOIN filial ON filial.idFilial = setor.fkFilial
WHERE DATEDIFF(CURRENT_DATE(), DATE(data_hora)) = 1
GROUP BY hora, dia, filial.idFilial
ORDER BY hora;

-- Dados de movimentação por sensor/setor para alimentar o mapa de calor.
CREATE VIEW vw_heatmap AS
	SELECT 
		filial.idFilial,
		sensor.idSensor,
		CASE 
			WHEN (
				SELECT COUNT(*)
				FROM sensor s2
				JOIN setor st2 ON st2.idSetor = s2.fkSetor
				WHERE st2.setor = setor.setor
				AND st2.fkFilial = setor.fkFilial
				AND s2.idSensor < sensor.idSensor
			) = 0
			THEN setor.setor
			ELSE CONCAT(
				setor.setor,
				(
					SELECT COUNT(*) + 1
					FROM sensor s2
					JOIN setor st2 ON st2.idSetor = s2.fkSetor
					WHERE st2.setor = setor.setor
					AND st2.fkFilial = setor.fkFilial
					AND s2.idSensor < sensor.idSensor
				)
			)
		END AS nomeSetor,
		COUNT(m.idMonitoramento) AS totalPessoas
	FROM sensor
		JOIN setor ON setor.idSetor = sensor.fkSetor
		JOIN filial ON filial.idFilial = setor.fkFilial
		LEFT JOIN (
			SELECT idMonitoramento, fkSensor
			FROM monitoramento
			WHERE DATE(data_hora) = CURRENT_DATE()
		) AS m ON m.fkSensor = sensor.idSensor
	GROUP BY
		sensor.idSensor,
		setor.setor,
		setor.fkFilial,
		filial.idFilial
	ORDER BY sensor.idSensor;
    
-- Retorna o nome do setor vinculado a um sensor específico.
CREATE VIEW vw_sensor_setor AS
	SELECT
		sensor.idSensor,
		setor.setor AS nomeSetor
	FROM sensor
	JOIN setor ON setor.idSetor = sensor.fkSetor;
    
-- Fluxo dos últimos 7 dias por setor, usado no gráfico semanal.
CREATE VIEW vw_fluxo_semana AS
	SELECT 
		filial.idFilial,
		DATE_FORMAT(m.data_hora, '%d/%m') AS dataFormatada,
		s.setor AS setor,
		COUNT(m.idMonitoramento) AS totalPessoas,
		DATE(m.data_hora) AS dia
	FROM monitoramento AS m
		JOIN sensor ON sensor.idSensor = m.fkSensor
		JOIN setor AS s ON s.idSetor = sensor.fkSetor
		JOIN filial ON filial.idFilial = s.fkFilial
		WHERE DATEDIFF(CURRENT_DATE(), DATE(m.data_hora)) BETWEEN 0 AND 6
		GROUP BY DATE(m.data_hora), dataFormatada, s.setor, dia, filial.idFilial
		ORDER BY DATE(m.data_hora), s.setor;
     
-- Base para identificar setor com maior ou menor fluxo no período.
CREATE VIEW vw_fluxo_max_min AS
	SELECT 
		filial.idFilial,
		s.setor AS setor,
		COUNT(m.idMonitoramento) AS qtdPessoas,
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
		GROUP BY mes, DATE_FORMAT(m.data_hora, '%d/%m'), s.setor, filial.idFilial;
        
-- Pico de fluxo por hora referente ao dia anterior.
CREATE VIEW vw_pico_hora AS
	SELECT 
		filial.idFilial,
		HOUR(data_hora) AS hora,
		DATE_FORMAT(data_hora, '%d/%m/%Y') AS ontem,
		COUNT(idMonitoramento) AS totalPessoas
	FROM monitoramento
		JOIN sensor ON sensor.idSensor = monitoramento.fkSensor
		JOIN setor ON setor.idSetor = sensor.fkSetor
		JOIN filial ON filial.idFilial = setor.fkFilial
		WHERE DATEDIFF(CURRENT_DATE(), DATE(data_hora)) = 1
		GROUP BY hora, ontem, filial.idFilial;
        
-- Compara o fluxo total entre os meses registrados.
CREATE VIEW vw_comparacao_fluxo AS
	SELECT 
		filial.idFilial,
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
		END AS mes,
		MONTH(m.data_hora) AS numeroMes
	FROM monitoramento AS m
		JOIN sensor ON sensor.idSensor = m.fkSensor
		JOIN setor ON setor.idSetor = sensor.fkSetor
		JOIN filial ON filial.idFilial = setor.fkFilial
		GROUP BY mes, numeroMes, filial.idFilial;
        
-- Lista filiais relacionadas à mesma matriz da filial atual.
CREATE VIEW vw_filiais AS
	SELECT 
		f.nome,
		f.idFilial AS novoIdFilial,
		f.fkMatriz
	FROM filial f
		JOIN filial m ON m.idFilial = f.fkMatriz
		LEFT JOIN usuario u ON f.idFilial = u.fkFilial;
        
-- Lista filiais diretamente vinculadas a uma matriz.
CREATE VIEW vw_filiais2 AS
	SELECT
		f.nome,
		f.idFilial AS novoIdFilial,
		f.fkMatriz
	FROM filial f
		JOIN filial m ON m.idFilial = f.fkMatriz;
        
-- Retorna o nome da filial e identifica sua matriz.
CREATE VIEW vw_nome_matriz AS
	SELECT
		f.idFilial,
		f.nome,
		f.fkMatriz,
        f.codigo
	FROM filial f
		LEFT JOIN filial m ON m.idFilial = f.fkMatriz;

-- Criação da view para KPI de fluxo por filial
CREATE VIEW vw_fluxo_por_filial AS
	SELECT 
		f.nome, 
		f.fkEmpresa, 
		m.idMonitoramento, 
		m.data_hora, 
		MONTH(data_hora) as mes
	FROM monitoramento m
		JOIN sensor ON sensor.idSensor = m.fkSensor
		JOIN setor s ON s.idSetor = sensor.fkSetor
		JOIN filial f ON f.idFilial = s.fkFilial;

-- Criação da view para KPI de fluxo por setor
CREATE VIEW vw_fluxo_por_setor AS
	SELECT 
		s.setor, 
        f.fkEmpresa, 
        m.idMonitoramento, 
        m.data_hora,
		MONTH(data_hora) as mes
	FROM monitoramento m
		JOIN sensor ON sensor.idSensor = m.fkSensor
		JOIN setor s ON s.idSetor = sensor.fkSetor
		JOIN filial f ON f.idFilial = s.fkFilial;


-- Fluxo semanal (média por dia da semana, mês atual), filtrada por empresa
CREATE VIEW vw_fluxo_semanal_empresa AS
    SELECT
        f.fkEmpresa,
        m.idMonitoramento,
        DAYNAME(m.data_hora) AS dia_semana,
        m.data_hora,
		MONTH(data_hora) as mes
    FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial AS f ON f.idFilial = s.fkFilial;

-- Fluxo por setor com empresa, para média semanal
CREATE VIEW vw_fluxo_setor_empresa AS
    SELECT
        f.fkEmpresa,
        f.idFilial,
        s.setor,
        m.idMonitoramento,
        m.data_hora,
		MONTH(data_hora) as mes
    FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial AS f ON f.idFilial = s.fkFilial;

-- Fluxo total por filial com empresa
CREATE VIEW vw_fluxo_filial_empresa AS
    SELECT
        f.fkEmpresa,
        f.idFilial,
        f.nome AS nome_filial,
        m.idMonitoramento,
        m.data_hora,
		MONTH(data_hora) as mes
    FROM monitoramento AS m
        JOIN sensor ON sensor.idSensor = m.fkSensor
        JOIN setor AS s ON s.idSetor = sensor.fkSetor
        JOIN filial AS f ON f.idFilial = s.fkFilial;

-- inserção de dados

INSERT INTO empresa(nome, status_empresa) VALUES 
('SuperMercados SPtech', 'Ativa');

INSERT INTO filial(codigo, nome, cnpj, logradouro, cidade, estado, cep, fkEmpresa, fkMatriz) VALUES
(12345, 'SuperMercado Central - central administrativa', '12345678000191', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100', 1, NULL),
(13465, 'Unidade Paulista', '12345678000192', 'Avenida Paulista, 2500', 'São Paulo', 'SP', '02010-200', 1, 1),
(53456, 'Unidade Mooca', '12345678000193', 'Rua da Mooca, 1500', 'São Paulo', 'SP', '03104-000', 1, 1),
(84567, 'Unidade Santo Amaro', '12345678000194', 'Av. Santo Amaro, 3200', 'São Paulo', 'SP', '04702-000', 1, 1);

INSERT INTO usuario(nome, cargo, email, senha, fkFilial) VALUES 
('SPtech', 'Administrador', 'sptech.consulting@gmail.com', 'Urubu100@', 1);

INSERT INTO setor (setor, fkFilial) VALUES
-- Unidade Santana
('Bebidas', 2),
('Hortifruti', 2),
('Açougue', 2),
('Padaria', 2),
('Laticínios', 2),
('Higiene', 2),
-- Unidade Mooca
('Bebidas', 3),
('Hortifruti', 3),
('Açougue', 3),
('Padaria', 3),
('Laticínios', 3),
('Higiene', 3),
-- Unidade Santo Amaro
('Bebidas', 4),
('Hortifruti', 4),
('Açougue', 4),
('Padaria', 4),
('Laticínios', 4),
('Higiene', 4);

INSERT INTO sensor (status_sensor, fkSetor) VALUES
-- Unidade Santana
('ativo', 2), 
('ativo', 2), 
('ativo', 5), 
('ativo', 5), 
('ativo', 1), 
('ativo', 1), 
('ativo', 6), 
('ativo', 6), 
('ativo', 3), 
('ativo', 3), 
('ativo', 4), 
('ativo', 4),
-- Unidade Mooca
('ativo', 8), 
('ativo', 8), 
('ativo', 11), 
('ativo', 11), 
('ativo', 7), 
('ativo', 7), 
('ativo', 12), 
('ativo', 12), 
('ativo', 9), 
('ativo', 9), 
('ativo', 10), 
('ativo', 10), 
-- Unidade Santo Amaro
('ativo', 14), 
('ativo', 14), 
('ativo', 17), 
('ativo', 17), 
('ativo', 13), 
('ativo', 13), 
('ativo', 18), 
('ativo', 18), 
('ativo', 15), 
('ativo', 15), 
('ativo', 16), 
('ativo', 16); 


INSERT INTO empresa(nome, status_empresa) VALUES 
('Loxen', 'Ativa');

INSERT INTO filial(codigo, nome, cnpj, logradouro, cidade, estado, cep, fkEmpresa, fkMatriz) VALUES
(00000, 'Loxen', '10203040506070', 'Av. Santa Isabel', 'São Paulo', 'SP', '04702-000', 2, null);

INSERT INTO usuario(nome, cargo, email, senha, fkFilial) VALUES 
('Suporte Loxen', 'Suporte', 'suporte@loxen.com', 'Suporte321@', 5);

-- Empresa de cada usuario
SELECT
    u.idFuncionario,
    u.nome AS usuario,
    u.cargo,
    f.nome AS filial,
    e.nome AS empresa
FROM usuario u
JOIN filial f ON u.fkFilial = f.idFilial
JOIN empresa e ON f.fkEmpresa = e.idEmpresa;

-- Filial de cada empresa
SELECT
    f.idFilial,
    f.nome AS filial,
    f.cidade,
    f.estado,
    e.nome AS empresa
FROM filial f
JOIN empresa e ON f.fkEmpresa = e.idEmpresa;

-- Usuario | Filial | Empresa
SELECT
    u.nome AS usuario,
    u.cargo,
    u.email,
    f.nome AS filial,
    e.nome AS empresa
FROM usuario u
INNER JOIN filial f
    ON u.fkFilial = f.idFilial
INNER JOIN empresa e
    ON f.fkEmpresa = e.idEmpresa
ORDER BY e.nome, f.nome, u.nome;


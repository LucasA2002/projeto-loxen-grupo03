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

-- INSERÇÃO DE DADOS
INSERT INTO empresa(nome, status_empresa) VALUES 
('Loxen', 'Ativa');

INSERT INTO filial(codigo, nome, cnpj, logradouro, cidade, estado, cep, fkEmpresa) VALUES
(12345, 'Filial Loxen', '1234567891234567891', 'Rua A', 'São Paulo', 'SP', '07500-000', 1);

INSERT INTO usuario(nome, cargo, email, senha, fkFilial) VALUES 
('sptech', 'Administrador', 'sptech.consulting@gmail.com', 'Urubu100@', 1);

INSERT INTO usuario(nome, cargo, email, senha, fkFilial) VALUES 
('Loxen Sup', 'Suporte', 'suporte@loxen.com', 'Loxen321@', 1);

INSERT INTO setor (setor, fkFilial) VALUES 
('Bebidas', 1);

INSERT INTO sensor(status_sensor, fkSetor) VALUES
('ativo', 1);

INSERT INTO monitoramento (fkSensor) VALUES
(1);

-- SELECT 
SELECT * FROM monitoramento;
SELECT * FROM usuario;
SELECT * FROM filial;
SELECT * FROM empresa;
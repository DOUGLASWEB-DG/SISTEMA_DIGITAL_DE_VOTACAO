CREATE DATABASE IF NOT EXISTS sdvpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sdvpro;

--Criação das tabelas do banco de dados
CREATE TABLE IF NOT EXISTS legislaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  inicio_legislatura YEAR NOT NULL,
  fim_legislatura YEAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Criação da tabela periodos_legislativos com chave estrangeira para legislaturas
CREATE TABLE IF NOT EXISTS periodos_legislativos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  legislatura_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  inicio DATE NOT NULL,
  fim DATE NOT NULL,
  FOREIGN KEY (legislatura_id) REFERENCES legislaturas(id)
);

--Criação da tabela sessoes com chave estrangeira para periodos_legislativos
CREATE TABLE IF NOT EXISTS sessoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  situacao ENUM('ABERTA','ENCERRADA','CANCELADA') DEFAULT 'ABERTA',
  exercicio YEAR NOT NULL,
  periodo_legislativo_id INT,
  sessao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (periodo_legislativo_id) REFERENCES periodos_legislativos(id)
);

--Criação da tabela vereadores
CREATE TABLE IF NOT EXISTS vereadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  apelido VARCHAR(100),
  partido VARCHAR(20),
  mesa VARCHAR(100),
  responsabilidade_mesa VARCHAR(100),
  foto_url VARCHAR(255),
  resumo TEXT,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Criação da tabela protocolos
CREATE TABLE IF NOT EXISTS protocolos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  data DATE NOT NULL,
  proponente VARCHAR(150) NOT NULL,
  ementa TEXT,
  status ENUM('ABERTO','ENCERRADO') DEFAULT 'ABERTO',
  exercicio YEAR NOT NULL,
  votacao VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Criação da tabela votos com chave estrangeira para protocolos e vereadores
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) DEFAULT 'OPERADOR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Criação da tabela votos com chave estrangeira para protocolos e vereadores
CREATE TABLE IF NOT EXISTS configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--- Inserção de configurações iniciais
INSERT IGNORE INTO configuracoes (chave, valor) VALUES
  ('nome_camara', 'Câmara Municipal'),
  ('tempo_pequeno_expediente', '05:00'),
  ('tempo_grande_expediente', '15:00'),
  ('voto_presidente', 'PRESIDENTE VOTA'),
  ('fonte_apreciacao', '16');

CREATE DATABASE IF NOT EXISTS sdvpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sdvpro;

CREATE TABLE IF NOT EXISTS legislaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  inicio_legislatura YEAR NOT NULL,
  fim_legislatura YEAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS periodos_legislativos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  legislatura_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  inicio DATE NOT NULL,
  fim DATE NOT NULL,
  FOREIGN KEY (legislatura_id) REFERENCES legislaturas(id)
);

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

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) DEFAULT 'OPERADOR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configuracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO configuracoes (chave, valor) VALUES
  ('nome_camara', 'Câmara Municipal'),
  ('tempo_pequeno_expediente', '05:00'),
  ('tempo_grande_expediente', '15:00'),
  ('voto_presidente', 'PRESIDENTE VOTA'),
  ('fonte_apreciacao', '16');

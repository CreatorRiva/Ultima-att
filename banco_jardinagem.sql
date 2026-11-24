CREATE DATABASE IF NOT EXISTS jardinagem_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jardinagem_db;

CREATE TABLE IF NOT EXISTS servicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  imagem VARCHAR(255) NOT NULL,
  pagina_url VARCHAR(255) DEFAULT NULL,
  ordem INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orcamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_cliente VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefone VARCHAR(30) DEFAULT NULL,
  servico_id INT DEFAULT NULL,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orcamento_servico
    FOREIGN KEY (servico_id) REFERENCES servicos(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS depoimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  autor VARCHAR(100) NOT NULL,
  comentario TEXT NOT NULL,
  avaliacao TINYINT NOT NULL DEFAULT 5,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO servicos (titulo, descricao, preco, imagem, pagina_url, ordem) VALUES
('Poda Sculpting e Estética Ornamental', 'Desenho, alinhamento e manutenção de arbustos e cercas vivas com cortes de precisão que garantem formatos geométricos perfeitos.', 350.00, 'img/servico1.jpg', 'servico1.html', 1),
('Capina Cirúrgica e Nivelamento', 'Erradicação de ervas daninhas, nivelamento do terreno e preparo do solo para novos plantios.', 480.00, 'img/servico2.jpg', 'servico2.html', 2),
('UTI do Gramado e Tratamento de Raiz', 'Descompactação do solo, correção de pH e adubação para recuperar a densidade e o verde do gramado.', 600.00, 'img/servico3.jpg', 'servico3.html', 3);

INSERT INTO depoimentos (autor, comentario, avaliacao) VALUES
('Carlos Eduardo Rocha', 'O Tonho passou com a enxada no canteiro e não encostou em uma flor sequer. Minha grama nunca esteve tão verde. Certeza que ela é mais bem tratada do que eu!', 5),
('Mariana Souza', 'Salvaram o paisagismo da pousada. Em dois dias, a poda ficou impecável e a adubação fez o gramado renascer. Serviço rápido e com um ótimo humor.', 5),
('Roberto Mendes', 'Ninguém resolvia o mato alto do meu terreno. Eles chegaram com a roçadeira e a enxada e deixaram tudo limpo e nivelado em poucas horas. Serviço bruto e profissional.', 5),
('Fernanda Lima', 'Pedi pra dar uma aparada nas cercas vivas e recebi de volta uma escultura. O Cláudio trata tesoura de poda como pincel. Virei cliente fiel.', 5),
('Eduardo Prado', 'Meu gramado estava amarelado havia meses. Depois da UTI do Gramado voltou a ficar verde em duas semanas. Recomendo de olhos fechados.', 5);
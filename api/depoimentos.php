<?php
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query(
            "SELECT id, autor, comentario, avaliacao, criado_em
             FROM depoimentos
             ORDER BY id ASC"
        );
        echo json_encode([
            'sucesso' => true,
            'dados' => $stmt->fetchAll()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao carregar depoimentos.'
        ]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $autor = trim($input['autor'] ?? '');
    $comentario = trim($input['comentario'] ?? '');
    $avaliacaoRaw = isset($input['avaliacao']) ? (int)$input['avaliacao'] : 5;
    $avaliacao = max(1, min(5, $avaliacaoRaw));

    if ($autor === '' || $comentario === '') {
        http_response_code(400);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Preencha seu nome e o seu depoimento.'
        ]);
        exit;
    }

    try {
        $sql = "INSERT INTO depoimentos (autor, comentario, avaliacao)
                VALUES (:autor, :comentario, :avaliacao)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':autor' => $autor,
            ':comentario' => $comentario,
            ':avaliacao' => $avaliacao
        ]);

        echo json_encode([
            'sucesso' => true,
            'id' => $pdo->lastInsertId(),
            'mensagem' => 'Depoimento publicado com sucesso!'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao salvar depoimento.'
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
?>
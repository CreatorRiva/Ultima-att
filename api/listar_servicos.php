<?php
require_once 'conexao.php';

try {
    $stmt = $pdo->query(
        "SELECT id, titulo, descricao, preco, imagem, pagina_url, ordem
         FROM servicos
         ORDER BY ordem ASC, id ASC"
    );
    echo json_encode([
        'sucesso' => true,
        'dados' => $stmt->fetchAll()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao carregar os serviços.'
    ]);
}
?>
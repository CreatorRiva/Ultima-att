<?php
require_once 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$nomeCliente = trim($input['nome_cliente'] ?? '');
$email = trim($input['email'] ?? '');
$telefone = trim($input['telefone'] ?? '');
$servicoIdRaw = $input['servico_id'] ?? '';
$servicoId = ($servicoIdRaw !== '' && $servicoIdRaw !== null) ? (int)$servicoIdRaw : null;
$mensagem = trim($input['mensagem'] ?? '');

if ($nomeCliente === '' || $email === '' || $mensagem === '') {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Preencha nome, e-mail e mensagem.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Informe um e-mail válido.'
    ]);
    exit;
}

if ($servicoId !== null && $servicoId > 0) {
    $checkStmt = $pdo->prepare("SELECT id FROM servicos WHERE id = :id");
    $checkStmt->execute([':id' => $servicoId]);
    if (!$checkStmt->fetch()) {
        http_response_code(400);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'O serviço selecionado não existe.'
        ]);
        exit;
    }
} else {
    $servicoId = null;
}

try {
    $sql = "INSERT INTO orcamentos
            (nome_cliente, email, telefone, servico_id, mensagem)
            VALUES
            (:nome_cliente, :email, :telefone, :servico_id, :mensagem)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome_cliente' => $nomeCliente,
        ':email' => $email,
        ':telefone' => $telefone !== '' ? $telefone : null,
        ':servico_id' => $servicoId,
        ':mensagem' => $mensagem
    ]);

    echo json_encode([
        'sucesso' => true,
        'id' => $pdo->lastInsertId(),
        'mensagem' => 'Orçamento enviado com sucesso! Em breve entraremos em contato.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao gravar o orçamento no banco de dados.'
    ]);
}
?>
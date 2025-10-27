<?php
// Usamos encabezados para decirle a JavaScript que esto es JSON
header('Content-Type: application/json; charset=utf-8');

// 1. RECOLECCIÓN Y VALIDACIÓN
// ¡Recuerda añadir name="asuntoPers" a tu HTML!
$asuntoFormulario = $_POST['Asunto'] ?? '1'; 
$asuntoPersonalizado = trim($_POST['asuntoPers'] ?? '');
$nombre = htmlspecialchars(trim($_POST['Nombre'] ?? ''));
$mail_original = trim($_POST['email'] ?? '');
$mensaje = htmlspecialchars(trim($_POST['Mensaje'] ?? ''));

$mail = filter_var($mail_original, FILTER_VALIDATE_EMAIL);

// Arreglo para la respuesta
$respuesta = [
    'exito' => false,
    'mensaje' => ''
];

if (!$mail || empty($nombre) || empty($mensaje)) {
    $respuesta['mensaje'] = 'Por favor, completa todos los campos correctamente.';
    echo json_encode($respuesta);
    exit;
}

// 2. LÓGICA DE ASUNTO
$mapa_asuntos = [
    '1' => 'Duda', '2' => 'Sugerencia', '3' => 'Opinión',
    '4' => 'Reporte/Queja', '5' => 'Invitación', '6' => 'Otro'
];
$asunto_texto = $mapa_asuntos[$asuntoFormulario] ?? 'Asunto desconocido';

// 3. SANITIZACIÓN PARA CABECERAS
$mail_seguro = str_replace(["\r", "\n"], '', $mail);
$asunto_pers_seguro = str_replace(["\r", "\n"], '', $asuntoPersonalizado);
$asuntoCompleto = 'Web RAS - ' . ($asuntoFormulario === '6' && $asunto_pers_seguro ? $asunto_pers_seguro : $asunto_texto);
$asunto_seguro = str_replace(["\r", "\n"], '', $asuntoCompleto);

// 4. CONSTRUCCIÓN DEL MENSAJE
$mensaje_final  = "Este mensaje fue enviado por: $nombre\r\n";
$mensaje_final .= "E-mail: $mail_original\r\n";
$mensaje_final .= "Asunto: $asuntoCompleto\r\n";
$mensaje_final .= "Mensaje:\r\n$mensaje\r\n\r\n";
$mensaje_final .= "Enviado el " . date('d/m/Y H:i:s');

// 5. CONSTRUCCIÓN DE CABECERAS
$para = 'ras.fiuady@gmail.com'; 
$header = "From: $mail_seguro\r\n";
$header .= "Reply-To: $mail_seguro\r\n";
$header .= "Content-Type: text/plain; charset=UTF-8\r\n";
$header .= "X-Mailer: PHP/" . phpversion();

// 6. ENVÍO
if (mail($para, $asunto_seguro, $mensaje_final, $header)) {
    // Éxito
    $respuesta['exito'] = true;
    $respuesta['mensaje'] = '¡Mensaje enviado con éxito! Gracias por contactarnos.';
} else {
    // Falla
    $respuesta['mensaje'] = 'Error al enviar el mensaje. Intenta de nuevo más tarde o contáctanos por nuestras redes sociales.';
}

// 7. DEVOLVER LA RESPUESTA JSON A JAVASCRIPT
echo json_encode($respuesta);
exit;
?>
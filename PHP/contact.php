<?php
$asuntoFormulario = $_POST['Asunto'] ?? 'Sin asunto';
$asuntoPersonalizado = $_POST['asuntoPers'] ?? '';
$nombre = htmlspecialchars(trim($_POST['Nombre'] ?? ''));
$mail = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$mensaje = htmlspecialchars(trim($_POST['Mensaje'] ?? ''));

// Validación básica
if (!$mail || empty($nombre) || empty($mensaje)) {
    header('Location:error.html');
    exit;
}

// Combinar asuntos si hay personalizado
$asuntoCompleto = 'Web RAS - ' . ($asuntoFormulario === '6' && $asuntoPersonalizado ? $asuntoPersonalizado : $asuntoFormulario);

// Construcción del cuerpo del mensaje
$mensaje_final  = "Este mensaje fue enviado por: $nombre\r\n";
$mensaje_final .= "E-mail: $mail\r\n";
$mensaje_final .= "Asunto: $asuntoCompleto\r\n";
$mensaje_final .= "Mensaje:\r\n$mensaje\r\n\r\n";
$mensaje_final .= "Enviado el " . date('d/m/Y H:i:s');

$para = 'nicolas.seguro@gmail.com';
$header = "From: $mail\r\n";
$header .= "Reply-To: $mail\r\n";
$header .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($para, $asuntoCompleto, $mensaje_final, $header);

header('Location:exito.html');
exit;
?>

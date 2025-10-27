/* SOLUCIÓN DE IA PARA EL FORMULARIO DE CONTACTO PENDIENTE DE REVISIÓN

Espera a que todo el HTML esté cargado */
document.addEventListener('DOMContentLoaded', function () {
  
  const formulario = document.getElementById('contactForm');
  const leyenda = document.getElementById('formLegend');
  const boton = document.getElementById('buttonForm');

  if (formulario) {
    formulario.addEventListener('submit', function (evento) {
      
      // 1. Previene el envío normal del formulario (que recarga la página)
      evento.preventDefault(); 

      // Muestra que se está enviando y deshabilita el botón
      leyenda.textContent = 'Enviando mensaje...';
      leyenda.className = 'enviando'; // Puedes darle un estilo a esto
      boton.disabled = true;

      // 2. Recolecta los datos del formulario
      const datos = new FormData(formulario);

      // 3. Envía los datos al PHP usando fetch (AJAX)
      fetch('../PHP/contact.php', {
        method: 'POST',
        body: datos,
      })
        .then(response => response.json()) // Convierte la respuesta de PHP a un objeto JS
        .then(data => {
          // 4. Procesa la respuesta JSON del PHP
          if (data.exito) {
            // ÉXITO
            leyenda.textContent = data.mensaje;
            leyenda.className = 'exito'; // Añade una clase para el estilo de éxito
            formulario.reset(); // Opcional: Limpia el formulario
            
            // Habilita el botón (o no, si prefieres que no envíen otro)
            // boton.disabled = false; 
            // Tu función verifyForm() debería deshabilitarlo de nuevo si el form está vacío
          } else {
            // ERROR
            leyenda.textContent = data.mensaje;
            leyenda.className = 'error'; // Añade una clase para el estilo de error
            boton.disabled = false; // Permite que lo intente de nuevo
          }
        })
        .catch(error => {
          // Error de red o si el PHP falló (ej. error 500)
          console.error('Error en fetch:', error);
          leyenda.textContent = 'Error de conexión. Revisa tu consola.';
          leyenda.className = 'error';
          boton.disabled = false;
        });
    });
  }

  // --- TU CÓDIGO EXISTENTE ---
  // Probablemente ya tienes funciones aquí como verifyForm() o topicChange()
  // Déjalas donde están.
});

/* Asegúrate de que tus funciones topicChange y verifyForm estén
  disponibles globalmente si las llamas desde el HTML con oninput.
  Si no, ponlas también dentro del 'DOMContentLoaded'.
*/

function topicChange(event) {
  document.getElementById("asuntoLabelCustom").classList.add("inputFilled");

  if (event.target.value == 6) {
    document.getElementById("asuntoPers").classList.remove("oculto");
    document
      .getElementById("asuntoLabelCustom")
      .classList.remove("inputFilled");
  } else {
    // document.getElementById("asuntoPers").classList.add("oculto");
  }
}

function inputFilled(event, numberInput) {
  if (event.target.value.trim() != "") {
    document
      .querySelectorAll(".labelCustom")
      [numberInput].classList.add("inputFilled");
  } else {
    document
      .querySelectorAll(".labelCustom")
      [numberInput].classList.remove("inputFilled");
  }
}

function verifyForm() {
  let filled = false;

  if (document.querySelector(".inputForm").value == 6) {
    filled = [...document.querySelectorAll(".inputForm")].every(
      (input) => input.value.trim() !== ""
    );
  } else {
    filled = [...document.querySelectorAll(".inputForm")]
      .filter((input) => input.id !== "asuntoPers")
      .every((input) => input.value.trim() !== "");
  }

  if (filled == true) {
    document.getElementById("buttonForm").removeAttribute("disabled");
  } else {
    document.getElementById("buttonForm").setAttribute("disabled", true);
  }
}

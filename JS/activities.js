// try {
//   fetch('../JSON/Actividadesoctubre2025.json')
//   .then(response => response.json())
//   .then(data => Actividades = data);
// } catch (error) {
//   console.error(error);
// } finally {
//   console.log(Actividades)
// }

function extraerEnlaceImagen(texto) {
  const limpio = texto
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\u0026/g, "&");

  const match = limpio.match(/<img[^>]*src="([^"]+)"/i);
  return match ? match[1] : null;
}

function formatearFecha(texto) {
  let fecha = new Date(texto);

  const opciones = { day: "numeric", month: "long", year: "numeric" };

  fechaFormateada = fecha.toLocaleDateString("es-MX", opciones);

  return fechaFormateada;
}

async function obtenerDatosDeActividades(url) {
    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }

        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Hubo un problema al consumir la API:", error.message);
        return null;
    }
}

// --- Segunda función que se ejecuta después de la carga ---
function mostrarActividadesListas(datos) {
    console.log("Actividades cargadas");
    // console.log(datos.data[0].attributes.title); 
    let ListaActividades = datos.data.filter(actividad => !actividad.attributes.keywords.includes("#directivos")).reverse();

    document.getElementById("GaleriaActivities").innerHTML="";

    ListaActividades.forEach(actividad => {
      document.getElementById("GaleriaActivities").innerHTML += `
        <a href="${actividad.attributes.link}" target="_blank" rel="noopener noreferrer" class="">
                    <div class="TarjetaActivity">
                        <img src="${extraerEnlaceImagen(actividad.attributes.header)}" alt="${actividad.attributes.title}" class="ImagenActivity">
                        <span class="NombreActivity">${actividad.attributes.title}</span><br>
                        <span class="DescripcionActivity">${formatearFecha(actividad.attributes["start-time"])}</span>
                    </div>
                </a>
      `;
    });
}

// --- Flujo principal ---
async function iniciarCarga() {
    const actividades = await obtenerDatosDeActividades('https://edward5126.github.io/RAS-FIUADY/JSON/Activities.json');
    
    // Si los datos se obtuvieron correctamente
    if (actividades) {
        mostrarActividadesListas(actividades);
    } else {
        console.warn("No se pudieron cargar las actividades.");
    }
}

iniciarCarga();

// https://events.vtools.ieee.org/RST/events/api/public/v7/events/list?tags=FIUADY,RAS,Actividad&tags_connector=AND
// https://events.vtools.ieee.org/feeds/v7/c/SBC03105.html?span=now-1.year~now.1.month&sort=start_time&tags=FIUADY,RAS,Actividad&tags_connector=AND
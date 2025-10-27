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

function revisarFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaEvento = new Date(anio, mes - 1, dia);

  const hoyCompleto = new Date();
  const hoyMediaNoche = new Date(
    hoyCompleto.getFullYear(),
    hoyCompleto.getMonth(),
    hoyCompleto.getDate()
  );

  return fechaEvento >= hoyMediaNoche;
}

async function obtenerDatosDeActividadesPasadas(url) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        `Error HTTP: ${respuesta.status} - ${respuesta.statusText}`
      );
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Hubo un problema al consumir la API:", error.message);
    return null;
  }
}

async function obtenerDatosDeActividadesSiguientes(url) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        `Error HTTP: ${respuesta.status} - ${respuesta.statusText}`
      );
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
  let ListaActividades = datos.data
    .filter(
      (actividad) => !actividad.attributes.keywords.includes("#directivos")
    )
    .reverse();

  document.getElementById("GaleriaActivities").innerHTML = "";

  ListaActividades.forEach((actividad) => {
    document.getElementById("GaleriaActivities").innerHTML += `
        <a href="${
          actividad.attributes.link
        }" target="_blank" rel="noopener noreferrer" class="">
                    <div class="TarjetaActivity">
                        <img src="${extraerEnlaceImagen(
                          actividad.attributes.header
                        )}" alt="${
      actividad.attributes.title
    }" class="ImagenActivity">
                        <span class="NombreActivity">${
                          actividad.attributes.title
                        }</span><br>
                        <span class="DescripcionActivity">${formatearFecha(
                          actividad.attributes["start-time"]
                        )}</span>
                    </div>
                </a>
      `;
  });
}

function mostrarActividadesNuevas(datos) {
  console.log("Actividades nuevas cargadas");

  const actividadesNuevas = datos
    .filter((actividad) => revisarFecha(actividad.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (actividadesNuevas.length > 0) {
    document.getElementById("nextActivitiesCarrousel").innerHTML = "";

    actividadesNuevas.forEach((element) => {
      if (element.link != "-") {
        document.getElementById("nextActivitiesCarrousel").innerHTML += `
                <div class="nextActivityCard">
                <h4>${element.title}</h4>
                <p>${formatearFecha(element.date)}</p>
                <a href="${
                  element.link
                }" target="_blank" rel="noopener noreferrer" class="buttonB">Ver más</a>
            </div>
        `;
      } else {
        document.getElementById("nextActivitiesCarrousel").innerHTML += `
                <div class="nextActivityCard">
                <h4>${element.title}</h4>
                <p>${formatearFecha(element.date)}</p>
            </div>
        `;
      }
    });
  } else {
    document.getElementById("nextActivitiesCarrousel").innerHTML = `
                <div class="nextActivityCard" id="activitiesEmpty">
                <h4>Agenda vacía, ¡por ahora!</h4>
                <p>${obtenerLeyendaAleatoria()}</p>
                <a href="https://www.instagram.com/ras.uady" target="_blank" rel="noopener noreferrer" class="buttonB">¡Síguenos!</a>
            </div>
        `;
  }
}

const leyendasVacias = [
  "No hay actividades programadas por el momento. ¡Vuelve pronto para ver las novedades!",
  "Actualmente no tenemos eventos, pero anunciaremos nuevos muy pronto. ¡Mantente al tanto!",
  "No hay eventos en el calendario por ahora. ¡Estamos preparando las siguientes actividades!",
  "De momento no hay eventos programados. ¡Revisa esta sección próximamente!",
  "Aún no hay actividades agendadas. ¡Pronto publicaremos las siguientes!",
  "¡Calma! Aún no hay eventos, pero ya estamos trabajando en ello. ¡No te desconectes!",
  'Por ahora no hay nada agendado. ¡Estamos "cocinando" lo que sigue!', // (Ojo: escapamos las comillas internas)
  "¡Ahorita no hay eventos, pero espéralos! Pronto tendremos novedades.",
  "Aún no publicamos nuevas actividades. ¡Paciencia, que ya vienen!",
  "¡Tranquilo! Pronto llenaremos esta agenda. ¡Mantente atento!",
  "¡Estamos afinando motores para lo que viene! Mantente al pendiente de nuevos eventos.",
  "¡Pronto tendremos más acción! Estamos planeando las siguientes actividades.",
  "¡Nuevos retos y eventos se aproximan! Revisa esta sección pronto.",
  "¡La próxima gran actividad está en camino! No dejes de revisar.",
  "¡Estamos preparando todo para nuestros próximos eventos! Mantente al tanto.",
];

function obtenerLeyendaAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * leyendasVacias.length);

  return leyendasVacias[indiceAleatorio];
}

// --- Flujo principal ---
async function iniciarCarga() {
  const actividades = await obtenerDatosDeActividadesPasadas(
    "https://edward5126.github.io/RAS-FIUADY/JSON/Activities.json"
  );

  // Si los datos se obtuvieron correctamente
  if (actividades) {
    mostrarActividadesListas(actividades);
  } else {
    console.warn("No se pudieron cargar las actividades.");
  }

  const actividadesNuevas = await obtenerDatosDeActividadesSiguientes(
    "https://edward5126.github.io/RAS-FIUADY/JSON/nextActivities.json"
  );

  if (actividadesNuevas) {
    mostrarActividadesNuevas(actividadesNuevas);
  } else {
    console.warn("No se pudieron cargar las actividades siguientes");
  }
}

iniciarCarga();

// https://events.vtools.ieee.org/RST/events/api/public/v7/events/list?tags=FIUADY,RAS,Actividad&tags_connector=AND
// https://events.vtools.ieee.org/feeds/v7/c/SBC03105.html?span=now-1.year~now.1.month&sort=start_time&tags=FIUADY,RAS,Actividad&tags_connector=AND

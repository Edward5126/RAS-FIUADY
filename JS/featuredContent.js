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

function mostrarContenidoDestacado(content) {
  const destacado = content.filter((item) => item.featured === true)[0];

  console.groupCollapsed("Evento destacado");

  if ((destacado != null) & (destacado != undefined)) {
    console.log("Destacado identificado");
    if (revisarFecha(destacado.date)) {
      console.log("Destacado aún vigente");
      if (destacado.link != "-") {
        console.log("Destacado con link");
            if (destacado.call != "-") {
              console.log("Destacado con convocatoria");
              document.getElementById("featured").classList.add("featuredLinked");
              document.getElementById("featured").innerHTML = `
              <h4><span>¡No te quedes fuera! Te esperamos en:</span><br><b>${destacado.title}</b></h4>
              <div id="featuredLinks">
                <a href="${destacado.link}" target="_blank" rel="noopener noreferrer">Conocer más</a>
                <a href="${destacado.call}" target="_blank" rel="noopener noreferrer" title="Leer convocatoria"><i class="icon icon-Formulario2"></i></a>
              </div>
              `;
            } else {
              console.log("Destacado con convocatoria");
              document.getElementById("featured").classList.add("featuredLinked");
              document.getElementById("featured").innerHTML = `
              <h4><span>¡No te quedes fuera! Te esperamos en:</span><br><b>${destacado.title}</b></h4>
              <a href="${destacado.link}" target="_blank" rel="noopener noreferrer">Conocer más</a>
              `;
            }
      } else {
        console.log("Destacado sin link");
        if (destacado.call != "-") {
              console.log("Destacado con convocatoria");
              document.getElementById("featured").classList.add("featuredNoLinked");
              document.getElementById("featured").innerHTML = `
                  <h4><span>¡No te quedes fuera! Te esperamos en:</span><br><b>${destacado.title}</b></h4>
                  <a href="${destacado.call}" target="_blank" rel="noopener noreferrer" title="Leer convocatoria"><i class="icon icon-Formulario2"></i></a>
                  `;
        } else {
              console.log("Destacado sin convocatoria");
              document.getElementById("featured").classList.add("featuredNoLinked");
              document.getElementById("featured").innerHTML = `
                  <h4><span>¡No te quedes fuera! Te esperamos en:</span><br><b>${destacado.title}</b></h4>
                  `;
        }
      }
    } else {
      console.warn("Destacado expirado");
      document.getElementById("featured").innerHTML = "";
      document.getElementById("featured").classList.add("oculto");
    }
  } else {
    console.warn("Destacado no identificado");
    document.getElementById("featured").innerHTML = "";
    document.getElementById("featured").classList.add("oculto");
  }

  console.groupEnd();
}

async function iniciarCarga() {
  const actividadesNuevas = await obtenerDatosDeActividadesSiguientes(
    "https://edward5126.github.io/RAS-FIUADY/JSON/nextActivities.json"
  );

  if (actividadesNuevas) {
    mostrarContenidoDestacado(actividadesNuevas);
  } else {
    console.warn("No se pudieron cargar las actividades siguientes");
  }
}

iniciarCarga();

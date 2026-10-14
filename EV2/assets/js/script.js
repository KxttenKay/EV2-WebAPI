const DigimonesSeccion = document.querySelector("#galeria");
const mensaje = document.querySelector("#mensaje");

const apiURL = "https://digi-api.com/api/v1/digimon?page=0&pageSize=8";

let digimones = [];

async function obtenerDigimones() {
    const respuesta = await fetch(apiURL);

    if (!respuesta.ok) {
        throw new Error("Error al consultar la API");
    }

    const datos = await respuesta.json();

    const resultados = await Promise.all(
        datos.content.map(async (digimon) => {
            const res = await fetch(digimon.href);

            if (!res.ok) {
                throw new Error("Error al obtener detalles");
            }

            const detalle = await res.json();

            return detalle;
        })
    );

    return resultados;
}

function mostrarDigimones(lista) {
    let template = "";

    lista.forEach((digimon) => {
        const nivel = digimon.levels?.[0]?.level || "No disponible";
        const atributo = digimon.attributes?.[0]?.attribute || "No disponible";
        const tipo = digimon.types?.[0]?.type || "No disponible";
        const imagen = digimon.images?.[0]?.href || "";

        template += `
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card tarjeta-digimon h-100">

                    <img src="${imagen}"
                        alt="${digimon.name}"
                        class="imagen-digimon">

                    <div class="card-body">
                        <h3>${digimon.name}</h3>
                        <p>Level: ${nivel}</p>
                        <p>Attribute: ${atributo}</p>
                        <p>Type: ${tipo}</p>
                    </div>

                </div>
            </div>
        `;
    });

    DigimonesSeccion.innerHTML = template;

    if (lista.length === 0) {
        mensaje.textContent = "No se encontraron Digimon.";
    } else {
        mensaje.textContent = "";
    }
}

async function renderDigimones() {
    mensaje.textContent = "Cargando Digimon...";

    try {
        digimones = await obtenerDigimones();

        mostrarDigimones(digimones);

    } catch (error) {
        mensaje.textContent = "Error al cargar los Digimon.";
        console.error(error);
    }
}

function filtrarDigimones() {
    const texto = document.querySelector("#buscador")
        .value.toLowerCase().trim();

    const filtrados = digimones.filter((digimon) => {
        return digimon.name.toLowerCase().includes(texto);
    });

    mostrarDigimones(filtrados);
}

document.querySelector("#buscador").addEventListener(
    "input",
    filtrarDigimones
);

document.querySelector("#formulario-busqueda").addEventListener(
    "submit",
    (evento) => {
        evento.preventDefault();
        filtrarDigimones();
    }
);

renderDigimones();

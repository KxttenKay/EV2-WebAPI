const DigimonesSeccion = document.querySelector("#galeria");
const apiURL = "https://digi-api.com/api/v1/digimon?page=0&pageSize=8";

async function obtenerDigimones() {
    const respuesta = await fetch(apiURL);
    const datos = await respuesta.json();

    console.log(datos);

    const digimones = await Promise.all(
        datos.content.map(async (digimon) => {
            const res = await fetch(digimon.href);
            const detalle = await res.json();

            return detalle;
        })
    );

    return digimones;
}

async function renderDigimones() {
    try {
        const digimones = await obtenerDigimones();
        let template = "";

        digimones.forEach((digimon) => {
            const nivel = digimon.levels?.[0]?.level || "No disponible";
            const atributo = digimon.attributes?.[0]?.attribute || "No disponible";
            const tipo = digimon.types?.[0]?.type || "No disponible";
            const imagen = digimon.images?.[0]?.href || "";

            template += `
                <div class="col-12 col-sm-6 col-lg-3">
                    <div class="card tarjeta-digimon h-100">
                        <img src="${imagen}" alt="${digimon.name}" class="imagen-digimon">

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

    } catch (error) {
        console.error("Error al obtener los Digimon:", error);
        document.querySelector("#mensaje").textContent =
            "No se pudieron cargar los Digimon.";
    }
}

renderDigimones();
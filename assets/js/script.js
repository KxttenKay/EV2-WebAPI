const usersSection = document.querySelector(".users");
const buscador = document.querySelector("#buscador");
const apiURL = "https://dragonball-api.com/api/characters?limit=10";

//Es el arreglo donde se almacenan los personajes obtenidos en la API.
let personajes = [];

//Función en la que se consulta a la API para obtener a esos personajes.
async function getUsers() {
    const res = await fetch(apiURL);
    const users = await res.json();
    return users.items;
}

function renderUsers(users) {
    let template = "";

    users.forEach((user) => {
        template += `
            <div class="user">
                <h3>${user.name}</h3>
                <img src="${user.image}" alt="${user.name}">
                <p>Poder Máximo: ${user.maxKi}</p>
                <p>Raza: ${user.race}</p>
                <p>Género: ${user.gender}</p>
                <p>Equipo: ${user.affiliation}</p>
            </div>
        `;
    });

    usersSection.innerHTML = template;
}

// Funcion que espera datos de la api y muestra a los personajes.
async function iniciar() {
    personajes = await getUsers();
    renderUsers(personajes);
}

iniciar();

// Se encarga de hacer el filtro por nombre y raza.
function filtrarPersonajes() {
    const texto = buscador.value.toLowerCase();

    const personajesFiltrados = personajes.filter((user) => {
        return user.name.toLowerCase().includes(texto) ||
               user.race.toLowerCase().includes(texto) ;
               
    });

    renderUsers(personajesFiltrados);
}

// Esto ejecuta o cambia el filtro según el texto colocado en el buscador, detecta los cambios.
buscador.addEventListener("input", filtrarPersonajes);
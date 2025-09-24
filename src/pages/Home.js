import getData from "../utils/getData.js";
import getCombinations from "../utils/getCombinations.js";

const Home = async () => {
    const { vuelos, minIda, maxIda } = await getData();
    const { combinaciones, minTotal, maxTotal } = getCombinations(vuelos);

    let tipoViaje = "ida";
    let precioMin = minIda;
    let precioMax = maxIda;
    let fechaInicio = "";
    let fechaFin = "";

    let pagActual = 1;
    const itemsPag = 10;

    const actualizarPreciosPorTipo = () => {
        tipoViaje = document.querySelector("input[name='tipo-viaje']:checked").value;

        const min = tipoViaje === "ida" ? minIda : minTotal;
        const max = tipoViaje === "ida" ? maxIda : maxTotal;

        const inputMin = document.getElementById("precio-min");
        const inputMax = document.getElementById("precio-max");

        inputMin.min = min;
        inputMin.max = max;
        inputMin.value = min;

        inputMax.min = min;
        inputMax.max = max;
        inputMax.value = max;

        precioMin = min;
        precioMax = max;

        pagActual = 1;
        render();
    };

    let resultados = [];

    const render = (nuevaBusqueda = false) => {
        const minPrecio = Number(document.getElementById("precio-min").value);
        const maxPrecio = Number(document.getElementById("precio-max").value);
        const inicio = document.getElementById("fecha-inicio").value;
        const final = document.getElementById("fecha-fin").value;

        if (nuevaBusqueda) {
            if (tipoViaje === "ida") {
                resultados = vuelos.filter(v => 
                    v.price >= minPrecio && 
                    v.price <= maxPrecio && 
                    (!inicio || new Date(v.date) >= new Date(inicio)) && 
                    (!final || new Date(v.date) <= new Date(final))
                ).map(v => {
                    const fecha = new Date(v.date).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    return `
                        <article class="Home-card">
                            <h2 class="Home-title">${v.origin} ➡ ${v.destination}</h2>
                            <span class="Home-fecha">${fecha}</span>
                            <span class="Home-price">$${v.price}</span>
                            <span class="Home-availability">Quedan ${v.availability} asientos disponibles.</span>
                        </article>
                    `;
                });

            } else {
                resultados = combinaciones.filter(c => 
                    c.total >= minPrecio && 
                    c.total <= maxPrecio && 
                    (!inicio || new Date(c.ida.date) >= new Date(inicio)) && 
                    (!final || new Date(c.vuelta.date) <= new Date(final))
                ).map(c => {
                    const fechaIda = new Date(c.ida.date).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    const fechaVuelta = new Date(c.vuelta.date).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    return `
                        <div class="IdaVuelta">
                            <article class="Home-card">
                                <h2 class="Home-title">${c.ida.origin} ➡ ${c.ida.destination}</h2>
                                <span class="Home-fecha">${fechaIda}</span>
                                <span class="Home-price">$${c.ida.price}</span>
                                <span class="Home-availability">Quedan ${c.ida.availability} asientos disponibles.</span>
                            </article>
                            <article class="Home-card">
                                <h2 class="Home-title">${c.vuelta.origin} ➡ ${c.vuelta.destination}</h2>
                                <span class="Home-fecha">${fechaVuelta}</span>
                                <span class="Home-price">$${c.vuelta.price}</span>
                                <span class="Home-availability">Quedan ${c.vuelta.availability} asientos disponibles.</span>
                            </article>
                            <p class="IdaVuelta-total">Total: $${c.total.toFixed(2)}</p>
                        </div>
                    `;
                });
            }
            pagActual = 1;
        }

        const totalPaginas = Math.ceil(resultados.length / itemsPag);
        const indInicio = (pagActual - 1) * itemsPag;
        const fin = indInicio + itemsPag;
        const visibles = resultados.slice(indInicio, fin).join("");

        document.getElementById("results").innerHTML = visibles || "<p>No se encontraron vuelos.</p>";

        const paginacion = document.getElementById("paginacion");
        if (paginacion) {
            paginacion.innerHTML = `
                <button ${pagActual === 1 ? "disabled" : ""} id="prev">Anterior</button>
                <span>Página ${pagActual} de ${totalPaginas || 1}</span>
                <button ${pagActual === totalPaginas ? "disabled" : ""} id="next">Siguiente</button>
            `;

            document.getElementById("prev")?.addEventListener("click", () => {
                if (pagActual > 1) {
                    pagActual--;
                    render();
                }
            });
            document.getElementById("next")?.addEventListener("click", () => {
                if (pagActual < totalPaginas) {
                    pagActual++;
                    render();
                }
            });
        }
    };

    const view = `
        <div class="Filtros">
            <label>
                <input type="radio" name="tipo-viaje" value="ida" checked> Solo ida
            </label>
            <label>
                <input type="radio" name="tipo-viaje" value="ida-vuelta"> Ida y vuelta
            </label>
            <label>Precio: 
                $<input type="number" id="precio-min" value="${minIda}"> - 
                $<input type="number" id="precio-max" value="${maxIda}">
            </label>
            <label>Desde: <input type="date" id="fecha-inicio"></label>
            <label>Hasta: <input type="date" id="fecha-fin"></label>
            <button id="buscar">Buscar</button>
        </div>
        <div class="Home-container">
            <div id="results" class="Home"></div>
            <div id="paginacion"></div>
        </div>
    `;

    return { view, render, actualizarPreciosPorTipo };
};

export default Home;
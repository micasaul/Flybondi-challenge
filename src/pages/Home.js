import getData from "../utils/getData.js";

const Home = async () => {
    const data = await getData();
    const vuelos = data || [];

    let minPrecio = Math.min(...vuelos.map(v => v.price));
    let maxPrecio = Math.max(...vuelos.map(v => v.price));
    let tipoViaje = "ida";
    let inicio = "";
    let final = "";

    const render = () => {
        minPrecio = Number(document.getElementById("precio-min").value);
        maxPrecio = Number(document.getElementById("precio-max").value);
        tipoViaje = document.querySelector("input[name='tipo-viaje']:checked").value;
        inicio = document.getElementById("fecha-inicio").value;
        final = document.getElementById("fecha-fin").value;

        let html = "";

        if (tipoViaje === "ida") {
            const filtrados = vuelos.filter(v =>
                v.price >= minPrecio &&
                v.price <= maxPrecio &&
                (!inicio || new Date(v.date) >= new Date(inicio)) &&
                (!final || new Date(v.date) <= new Date(final))
            );

            html = filtrados.map(v => {
                const fecha = new Date(v.date).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });

                return `
                    <article class="Home-card">
                        <h2 class="Home-title">${v.origin} ➡ ${v.destination}</h2>
                        <span class="Home-fecha">${fecha}</span> 
                        <span class="Home-price">$${v.price}</span>
                        <span class="Home-availability">Quedan ${v.availability} asientos disponibles.</span>
                    </article>  
                `;
            }).join("");
        } else{
            const idas = vuelos.filter(v => !inicio || new Date(v.date) >= new Date(inicio));
            const vueltas = vuelos.filter(v => !final || new Date(v.date) <= new Date(final));
            
            let combinaciones = [];
            idas.forEach(ida => {
                vueltas.forEach(vuelta => {
                    if(
                        ida.origin === vuelta.destination &&
                        ida.destination === vuelta.origin &&
                        new Date(ida.date) < new Date(vuelta.date)
                    ){
                        combinaciones.push({ ida, vuelta, total: ida.price + vuelta.price});
                    }
                });
            });

            if (combinaciones.length > 0) {
                const totales = combinaciones.map(c => c.total);
                const minTotal = Math.min(...totales);
                const maxTotal = Math.max(...totales);

                combinaciones = combinaciones.filter(c => c.total >= minTotal && c.total <= maxTotal);
                document.getElementById("precio-min").value = minTotal.toFixed(2);
                document.getElementById("precio-max").value = maxTotal.toFixed(2);
            }

            html = combinaciones.map(c => {
                const fechaIda = new Date(c.ida.date).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
                const fechaVuelta = new Date(c.vuelta.date).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
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
            }).join("");
        }
        
        document.getElementById("results").innerHTML = html || "<p>No se encontraron vuelos que coincidan con los filtros aplicados.</p>";
    };

    const view = ` 
        <div class="Filtros">
            <label>Precio: 
                $<input type="number" id="precio-min" min=${minPrecio} max=${maxPrecio} value="${minPrecio}">
                -
                $<input type="number" id="precio-max" min=${minPrecio} max=${maxPrecio} value="${maxPrecio}">
            </label>
            <br>
            <label>
                <input type="radio" name="tipo-viaje" value="ida" checked> Solo ida
            </label>
            <label>
                <input type="radio" name="tipo-viaje" value="ida-vuelta"> Ida y vuelta
            </label>
            <br>
            <label>Desde: <input type="date" id="fecha-inicio"></label>
            <label>Hasta: <input type="date" id="fecha-fin"></label>
        </div>
        <div id="results" class="Home"></div>
    `;       

    return { view, render};
}

export default Home;
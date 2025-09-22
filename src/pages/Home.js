import getData from "../utils/getData.js";

const Home = async () => {
    const data = await getData();
    console.log(data);

    const vuelos = data || [];

    const view = ` 
        <div class="Home">
            ${
                vuelos.map(vuelo => {
                    const fecha = new Date(vuelo.date).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return `
                        <article class="Home-card">
                            <h2 class="Home-title">${vuelo.origin} ➡ ${vuelo.destination}</h2>
                            <span class="Home-fecha">${fecha}</span> 
                            <span class="Home-price">$${vuelo.price}</span>
                            <span class="Home-availability">Quedan ${vuelo.availability} asientos disponibles.</span>
                        </article>    
                    `;
                }).join('')
            }
        </div>
    `;       

    return view;
}

export default Home;
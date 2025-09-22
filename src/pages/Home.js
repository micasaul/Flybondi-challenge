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
                            <h3>${fecha}</h3>
                            <h2>${vuelo.origin} ➡ ${vuelo.destination}</h2>
                            <h3>Price: $${vuelo.price}</h3>
                            <h4>Seats Available: ${vuelo.availability}</h4>
                        </article>    
                    `;
                }).join('')
            }
        </div>
    `;       

    return view;
}

export default Home;
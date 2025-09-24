const API = 'https://raw.githubusercontent.com/flybondi/dev-challenge/refs/heads/master/dataset.json';

const getData = async () => {
    try {
        const response = await fetch(API);
        const data = await response.json();
        
        const precios = data.map(v => v.price);
        const minIda = precios.length ? Math.min(...precios) : 0;
        const maxIda = precios.length ? Math.max(...precios) : 0;
        
        return { vuelos: data, minIda, maxIda };
    } catch (error) {
        console.log('Fetch error', error);
        return { vuelos: [], minIda: 0, maxIda: 0 };
    }
};

export default getData;
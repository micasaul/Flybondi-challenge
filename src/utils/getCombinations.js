const getCombinations = (vuelos) => {
    const idas = vuelos;
    const vueltas = vuelos;

    const mapaVueltas = new Map();
    vueltas.forEach(v => {
        const key = `${v.origin}-${v.destination}`;
        if (!mapaVueltas.has(key)) mapaVueltas.set(key, []);
        mapaVueltas.get(key).push(v);
    });

    let combinaciones = [];
    idas.forEach(ida => {
        const key = `${ida.destination}-${ida.origin}`;
        const posiblesVueltas = mapaVueltas.get(key) || [];
        posiblesVueltas.forEach(vuelta => {
        if (new Date(ida.date) < new Date(vuelta.date)) {
            combinaciones.push({ ida, vuelta, total: ida.price + vuelta.price });
        }
        });
    });

    const totales = combinaciones.map(c => c.total.toFixed(2));
    const minTotal = totales.length ? Math.min(...totales) : 0;
    const maxTotal = totales.length ? Math.max(...totales) : 0;

    return { combinaciones, minTotal, maxTotal };
};

export default getCombinations;

import './src/styles/style.css'
import Header from './src/templates/Header'
import Home from './src/pages/Home'
import Error404 from './src/pages/Error404'

const App = async () => {
    const header = document.getElementById('header');
    const content = document.getElementById('content');

    header.innerHTML = await Header();

    const hash = location.pathname.toLowerCase() || '/';
    if (hash === '/') {
        const home = await Home();
        content.innerHTML = home.view;

        document.querySelectorAll("input[name='tipo-viaje']")
        .forEach(r => r.addEventListener("change", () => {
            home.actualizarPreciosPorTipo();
            home.render(true); 
        }));

        document.getElementById("buscar").addEventListener("click", () => home.render(true));

        home.render(true);
    } else {
        content.innerHTML = await Error404();
    }
};

window.addEventListener('load', App);
window.addEventListener('hashchange', App);
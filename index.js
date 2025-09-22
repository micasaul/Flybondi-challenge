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

        const filtros = document.querySelector(".Filtros");
        filtros.addEventListener("input", home.render);
        filtros.addEventListener("change", home.render);

        home.render();
    } else {
        content.innerHTML = await Error404();
    }

};

window.addEventListener('load', App);
window.addEventListener('hashchange', App);
import './src/styles/style.css'
import Header from './src/templates/Header'
import Home from './src/pages/Home'
import Error404 from './src/pages/Error404'

const App = async () => {
    const header = document.getElementById('header');
    const content = document.getElementById('content');

    header.innerHTML = await Header();
    
    const hash = location.pathname.toLowerCase() || '/';

    let render;
    if (hash === '/') {
        render = Home;
    } else {
        render = Error404;
    }

    content.innerHTML = await render();
}

window.addEventListener('load', App);
window.addEventListener('hashchange', App);
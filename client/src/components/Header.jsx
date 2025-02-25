// importamos los componentes necesarios
import { Link } from 'react-router-dom';

// Inicializamos el componente
const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/"><img src="/src/img/logo.svg" alt="home" /></Link>
                    </li>
                    <li>
                        <Link to="/favorites"><img src="/src/img/corazon.png" alt="favoritos" /></Link>
                        <a href="https://www.flaticon.es/iconos-gratis/fechado" title="fechado iconos">Fechado iconos creados por Hat Tech - Flaticon</a>
                    </li>
                    <li>
                        <Link to="/login"><img src="/src/img/usuario.png" alt="login" /></Link>
                        <a href="https://www.flaticon.es/iconos-gratis/usuario" title="usuario iconos">Usuario iconos creados por Freepik - Flaticon</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

// Exportamos el componente
export default Header;
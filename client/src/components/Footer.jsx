// importamos los Hooks necesarios.

// Importamos los componentes necesarios.
import { Link } from "react-router-dom";

// Importamos el contexto de autenticación.


// Importamos la URL de nuestra API.


// Inicializamos el componente
const Footer = () => {
    return (
        <>
            <footer>
                {/* Sección de contacto */}
                <div className="Contacto">
                    <h3>Contactar</h3>
                    <p>Email: contacto@hackafly.com</p>
                    <p>Fax: +35 123 456 789</p>
                    <p>Teléfono: +35 123 456 789</p>
                    <p>Dirección: Calle Falsa 123,Madrid</p>
                    <p>País: España</p>
                    <p>CP: 12345</p>
                </div>

                {/* Sección de ayuda al cliente*/}
                <div className="About">
                    <h3>About</h3>
                    <ul>
                        <li><Link to="/about">Sobre nosotros</Link></li>
                        <li><Link to="/funcionamiento">Como funciona nuestra Web</Link></li>
                        <li><Link to="/team">Quienes somos</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Sección de información */}
                <div className="footer-section">

                    {/* Sección de términos y condiciones/privacidad/cookies*/}
                    <div className="footer-info">
                        <ul>
                            <li><p>Copyright © 2025 HackaFligth Company S.L. Todos los derechos reservados.</p></li>
                            <li><Link to="/cookies">Configuración de las cookies</Link></li>
                            <li><Link to="/privacidad">Política de privacidad</Link></li>
                            <li><Link to="/términos">Términos y Condiciones</Link></li>
                        </ul>
                    </div>

                    { /*Sección de redes sociales*/}
                    <div className="footer-social">
                        <ul>
                            <li><img src="/public/face.png" alt="Facebook" /></li>
                            <li><img src="/public/insta.png" alt="Instagram" /></li>
                            <li><img src="/public/x.png" alt="X" /></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};

// Exportamos el componente
export default Footer;

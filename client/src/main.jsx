// Importamos la función que indica cuál es la etiqueta raíz del html.
import { createRoot } from 'react-dom/client';

// Importamos los componentes.
import App from './App.jsx';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Importamos los estilos.
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);

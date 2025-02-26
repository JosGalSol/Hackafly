// Importamos los componentes.
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';

// Importamos las páginas.
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminListUsers from './pages/AdminListUsers';
import NotFoundPage from './pages/NotFoundPage';
import ValidateUserPage from './pages/ValidateUserPage';
import LoginPage from './pages/LoginPage.jsx';

const App = () => {
    return (
        <>
            <Header />

            <Toaster position='top-center' />

            {/* Todos los endpoints han de definirse dentro de este compontente. */}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/admin/users' element={<AdminListUsers />} />

                <Route path='/login' element={<LoginPage />} />
                <Route
                    path='/validate/:regCode'
                    element={<ValidateUserPage />}
                />
                {/*<Route path="/users/profile" element={<UserProfilePage />} />*/}
                {/*<Route
                    path="/users/password/recovery/request"
                    element={<SendRecoveryPassPage />}
                />*/}
                {/*<Route
                    path="/users/password/:recoverPassCode"
                    element={<UseRecoveryPassCode />}
                />*/}
                {/* Añadir más rutas de endpoints. */}

                <Route path='*' element={<NotFoundPage />} />
            </Routes>

            <Footer />
        </>
    );
};

export default App;

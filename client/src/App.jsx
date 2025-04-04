// Importamos los componentes.
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

// Importamos las páginas.
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminListUsers from './pages/AdminListUsers';
import NotFoundPage from './pages/NotFoundPage';
import ValidateUserPage from './pages/ValidateUserPage';
import UserProfilePage from './pages/UserProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import LoginPage from './pages/LoginPage';
import RatingPage from './pages/RatingPage';
import RatingsListPage from './pages/RatingsListPage';
import FavoritesPage from './pages/FavoritesPage';
import FavoriteDetailsEditPage from './pages/FavoriteDetailsEditPage';
import AboutUs from './pages/AboutUs';
import SendRecoverPassPage from './pages/SendRecoveryPassPage';
import ResetPassword from './pages/ResetPassword';
import TeamPage from './pages/TeamPage';
import Header from './components/Header';

const App = () => {
    return (
        <>
        <Header />
            <Toaster position='top-center' />
            {/* Todos los endpoints han de definirse dentro de este compontente. */}
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/search-results' element={<SearchResultsPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/admin/users' element={<AdminListUsers />} />
                <Route path='/login' element={<LoginPage />} />
                <Route
                    path='/validate/:regCode'
                    element={<ValidateUserPage />}
                />
                <Route path='/users/profile' element={<UserProfilePage />} />
                <Route
                    path='/users/profile/edit'
                    element={<EditProfilePage />}
                />
                <Route
                    path='/users/Profile/password'
                    element={<ChangePasswordPage />}
                />
                <Route path='/favorites' element={<FavoritesPage />} />
                <Route
                    path='/users/password/recover/request'
                    element={<SendRecoverPassPage />}
                />
                <Route
                    path='/users/password/:recoverPassCode'
                    element={<ResetPassword />}
                />
                <Route
                    path='/favorites/:favoriteId'
                    element={<FavoriteDetailsEditPage />}
                />
                <Route path='/users/ratings' element={<RatingPage />} />
                <Route path='/ratings' element={<RatingsListPage />} />
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/team' element={<TeamPage />} />
            </Routes>
            <Footer />
        </>
    );
};

export default App;

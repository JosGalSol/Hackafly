import { AuthContext } from '../contexts/AuthContext';
import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useRatingList from '../hooks/useRatingList';
import toast from 'react-hot-toast';

import RatingListItem from '../components/RatingListItem';

const { VITE_API_URL } = import.meta.env;

const RatingPage = () => {
    const { authToken, authUser, authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [rate, setRate] = useState('');
    const [comment, setComment] = useState('');

    const { ratings } = useRatingList();
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(null);

    const handleRating = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const res = await fetch(`${VITE_API_URL}/api/users/ratings`, {
                method: 'POST',
                headers: {
                    Authorization: authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    rate: Number(rate),
                    comment,
                }),
            });

            const body = await res.json();

            if (body.status === 'error') {
                throw new Error(body.message);
            }

            toast.success(body.message, {
                id: 'rating',
                duration: 5000,
            });

            navigate('/');
        } catch (err) {
            toast.error(err.message, { id: 'rating', duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading && authToken) {
        return <div>Loading...</div>;
    }

    if (!authUser || !authToken) {
        return <Navigate to='/login' />;
    }

    return (
        <>
            
            <main className='bg-gradient-to-b from-dark-blue to-white min-h-screen flex flex-col justify-between'>
                <div className='flex flex-col items-center justify-center flex-1 p-4'>
                    <section className='bg-white p-8 sm:p-10 rounded-lg shadow-md w-full max-w-lg lg:max-w-4xl transition transform hover:scale-[1.008]'>
                        <h2 className='text-3xl sm:text-4xl font-heading font-light text-dark-blue text-center mb-6'>
                            DÉJANOS UN COMENTARIO
                        </h2>
                        <p className='text-gray-600 text-center mb-8'>
                            Ayúdanos a mejorar nuestra plataforma para poder
                            llevarte cada día más lejos al mejor precio.
                        </p>
                        <form onSubmit={handleRating} className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='title'
                                    className='block text-[#083059] font-medium mb-2'
                                >
                                    Título:
                                </label>
                                <input
                                    type='text'
                                    id='title'
                                    className='w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9]'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <label className='block text-[#083059] font-medium'>
                                    Valoración:
                                </label>
                                <div className='flex space-x-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type='button'
                                            onClick={() => setRate(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(null)}
                                            className={`text-3xl transition ${
                                                (hover || rate) >= star
                                                    ? 'text-medium-blue' // Color cuando se selecciona o pasa el mouse
                                                    : 'text-gray-400'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <p className='text-[#083059] font-medium'>
                                    {rate
                                        ? `Has seleccionado ${rate} estrellas`
                                        : 'Selecciona una valoración'}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor='comment'
                                    className='block text-[#083059] font-medium mb-2'
                                >
                                    Descripción:
                                </label>
                                <textarea
                                    name='comment'
                                    id='comment'
                                    className='w-full p-3 border border-[#3951AA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#179DD9] min-h-[100px] mb-6'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                >
                                </textarea>

                                <button
                                    disabled={loading}
                                    className='w-full bg-[#083059] text-white py-3 px-4 rounded-md hover:bg-[#3951AA] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                                >
                                    {loading
                                        ? 'Enviando...'
                                        : 'Enviar valoración'}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className='mt-6'>
                        <section className='bg-white p-8 sm:p-10 rounded-lg shadow-md w-full max-w-lg lg:max-w-4xl transition transform hover:scale-[1.008]'>
                            <Link
                                to='/ratings'
                                className='hover:text-[#179DD9] transition-colors'
                            >
                                <h2 className='text-3xl sm:text-3xl font-heading font-light text-dark-blue text-center mb-6'>
                                    ÚLTIMAS VALORACIONES
                                </h2>
                            </Link>

                            <div className='space-y-4'>
                                {ratings &&
                                    ratings.slice(0, 3).map((rating) => (
                                        <div key={rating.id}>
                                            <RatingListItem
                                                ratingId={rating.id}
                                                title={rating.title}
                                                rate={rating.rate}
                                                comment={rating.comment}
                                                username={rating.username}
                                                createdAt={rating.createdAt}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </section>
                    </section>
                </div>
            </main>
        </>
    );
};

export default RatingPage;



const teamMembers = [
    { name: "Josep Galán", image: "/p1.png" },
    { name: "Gregory Pimentel", image: "/p2.png" },
    { name: "Ángela del Pan", image: "/p3.png" },
    { name: "Felipe Sarria", image: "/p4.png" },
    { name: "Ricardo Estupiñán", image: "/p5.png" },
    { name: "Camilo Noreña", image: "/p6.png" }
];

const TeamPage = () => {
    return (
        <>
            
            <main className='bg-[#E5F7FF] flex flex-col items-center justify-center p-6 h-auto'>
                <div className='w-full max-w-4xl mx-auto'>
                    <section className='bg-[#083059] text-white p-12 rounded-lg shadow-lg mb-8 transform hover:scale-[1.02] transition-transform'>
                        <h1 className='text-4xl font-bold text-center mb-6'>
                            Nuestro Equipo
                        </h1>
                        <p className='text-xl text-center max-w-2xl mx-auto opacity-90'>
                            Un equipo apasionado por la innovación y la tecnología, comprometido con ofrecer la mejor experiencia a nuestros usuarios.
                        </p>
                    </section>

                    {/* Sección del equipo */}
                    <section className='bg-white p-8 rounded-lg shadow-md'>
                        <div className='text-center mb-8'>
                            <h2 className='text-3xl font-bold text-[#083059] mb-4'>
                                Conoce a Nuestro Equipo
                            </h2>
                            <div className='w-24 h-1 bg-[#179DD9] mx-auto'></div>
                        </div>
                        <div className='grid md:grid-cols-3 gap-6'>
                            {teamMembers.map((member, index) => (
                                <div key={index} className='bg-[#E5F7FF] p-6 rounded-lg transform hover:scale-105 transition-transform shadow-md text-center'>
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className='w-24 h-24 rounded-full mx-auto object-cover'
                                    />
                                    <h3 className='font-bold text-[#083059] mt-4 text-xl'>
                                        {member.name}
                                    </h3>
                                    <p className='text-gray-600 mt-2'>
                                        Fullstack Developer
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default TeamPage;
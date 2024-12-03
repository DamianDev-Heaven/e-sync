import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import FeaturedEvents from './FeaturedEvents';
import { supabase } from '../supabaseClient';
import useAuth from './hooks/useAuth';
import { useEffect } from 'react';

const includedFeatures = [
    'Acceso Anticipado',
    'Descuentos Exclusivos',
    'Insignias Únicas',
    'Comentarios Destacados',
    'Experiencias VIP',
    'Atención Personalizada',
    'Reembolso de Hasta 1 Semana',
    'Meet and Great en Eventos Seleccionados'
];  

const Welcome = () => {
    const { user, loading } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error closing session:", error.message);
    } else {
      console.log("Usuario ha cerrado sesión");
      
      navigate('/');
    }
  };
    
    useEffect(() => {
        if (loading) return; 
        if (!user) {
            navigate('/'); 
        }
    }, [loading, user, navigate]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onLogout={handleLogout} />
            {/* Hero Section */}
            <section className="relative bg-indigo-600 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                        <span className="block">Vive la experiencia</span>
                        <span className="block text-indigo-200">E.Sync</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Descubre los mejores eventos deportivos, conciertos y espectáculos. 
                        Compra tus entradas de forma segura y rápida.
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                        <div className="rounded-md shadow">
                            <Link
                                to="/LoginPage"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                            >
                                Ver eventos
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="subscripciones" className="pt-5 tracking-tight ">
                <div className="py-24 sm:py-32 text-center">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Obten nuestra membresía</h2>
                            <p className="mt-6 text-lg leading-8 text-black">
                                Conviértete en parte de una comunidad exclusiva que vive el entretenimiento en su máxima expresión.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-300 bg-custom-white sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900">Únete a <span className='text-custom-red'>E-Pass</span></h3>
                                <p className="mt-6 text-base leading-7 text-gray-700">
                                    Con <span className='text-custom-red font-bold'>E-Pass</span>, no solo obtienes boletos, obtienes acceso a una experiencia de entretenimiento excepcional. ¡Únete y empieza a disfrutar de todos estos beneficios hoy mismo!
                                </p>
                                <div className="mt-10 flex items-center gap-x-4"> 
                                    <h4 className="flex-none text-sm font-semibold leading-6 text-custom-blue ">¿Qué incluye?</h4>
                                    <div className="h-px flex-auto bg-gray-300" />
                                </div>
                                <ul
                                    role="list"
                                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-700 sm:grid-cols-2 sm:gap-6"
                                >
                                    {includedFeatures.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                                <div className="rounded-2xl bg-custom-white py-10 text-center ring-0 lg:flex lg:flex-col lg:justify-center lg:py-16">
                                    <div className="mx-auto max-w-xs px-8">
                                        <p className="text-base font-semibold text-gray-600">Paga una vez al mes, disfruta de beneficios exclusivos siempre</p>
                                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                            <span className="text-5xl font-bold tracking-tight text-green-700">$5.99</span>
                                            <span className="text-sm font-semibold leading-6 tracking-wide text-green-700">USD</span>
                                        </p>
                                        <a
                                            href="#"
                                            className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-custom-yellow-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Obtener Ahora
                                        </a>
                                        <p className="mt-6 text-xs leading-5 text-gray-600">
                                            Facturas y recibos disponibles para facilitar el reembolso de la empresa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Soporte */}
            <section id="soporte">
                <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                            <div className="max-w-xl lg:max-w-lg">
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">¿Cómo podemos ayudarte?</h2>
                                <p className="mt-4 text-lg leading-8 text-black text-justify">
                                    En <span className='text-custom-blue font-bold'>E-Sync</span>, nos dedicamos a ofrecerte una experiencia de entretenimiento excepcional, y eso incluye un soporte al 
                                    cliente de primera calidad. Te enviaremos un correo al que nos brindaste en breve, asegurándonos de responder a tu consulta lo más pronto posible. Estamos aquí para 
                                    ayudarte en cada paso del camino, porque tu satisfacción es nuestra máxima prioridad.
                                </p>
                                <div className="mt-6 flex max-w-md gap-x-4">
                                    <label htmlFor="email-address" className="sr-only">
                                        Email address
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Correo Electronico"
                                        autoComplete="email"
                                        className="min-w-0 flex-auto rounded-md border-0 /5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    />
                                    <button
                                        type="submit"
                                        className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-custom-yellow-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                        Enviar
                                    </button>
                                </div>
                            </div>
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                                <div className="flex flex-col items-start">
                                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    </div>
                                    <dt className="mt-4 font-semibold text-custom-red">Articulos Semanales</dt>
                                    <dd className="mt-2 leading-7 text-black text-justify">
                                        Además de nuestro soporte, nuestros usuarios tienen acceso a artículos semanales sobre eventos y novedades del mundo del entretenimiento.
                                    </dd>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    </div>
                                    <dt className="mt-4 font-semibold text-custom-red">Guías de Ayuda</dt>
                                    <dd className="mt-2 leading-7 text-black text-justify">
                                        Contamos con una sección de guías donde podrás encontrar respuestas a preguntas frecuentes y otros temas que puedan interesarte.
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedEvents />
        </div>
    );
};

export default Welcome;
import { FaHospital, FaDonate } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ImgLogo from '../assets/rakt.png'


const LandingPage = () => {

    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
            <header className="text-center mb-10 flex-col">

                <h1 className="text-6xl font-extrabold text-red-600 mb-4">RaktSevva</h1>


                <p className="text-3xl font-semibold text-slate-800 pt-3">
                    Revolutionizing blood donations with seamless management and transparency
                </p>
            </header>
            <div className='flex text-center p-7 font-extrabold text-4xl text-red-600'>Servies Offered</div>
            <div className="w-full max-w-6xl flex justify-around items-center gap-5">
                <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center hover:bg-red-200 transition-all duration-300 w-1/3">
                    <FaHospital className="text-5xl text-red-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Hospital Dashboard</h2>
                    <p className="text-gray-700 text-center mb-6 text-lg">
                        Manage blood requests, monitor stock, and stay updated with real-time data.
                    </p>

                </div>

                <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center hover:bg-red-200 transition-all duration-300 w-1/3">
                    <FaDonate className="text-5xl text-red-600 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Blood Bank Dashboard</h2>
                    <p className="text-gray-700 text-center mb-6 text-lg">
                        Ensure a smooth flow of blood donations and timely allocation to hospitals.
                    </p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center hover:bg-red-200 transition-all duration-300 w-1/3">
                    <FaDonate className="text-5xl text-red-600 mb-4" />
                    <h2 className="text-xl font-bold mb-2 flex">Donation Camp Dashboard</h2>
                    <p className="text-gray-700 text-center mb-6 text-lg">
                        Ensure a timely central analysis of blood drives and allocation to blood banks.
                    </p>
                </div>
            </div>
            <div className='flex gap-5 pt-4 mt-4'>
                <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-xl font-bold">
                    LOGIN
                </Link>
                <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-xl font-bold">
                    REGISTER
                </Link>
            </div>

            {/* Add subtle animations */}
            <div className="absolute top-10 left-5 w-24 h-20 rounded-full">
                <img className='rounded-xl' src={ImgLogo} alt="" />
            </div>

        </div >
    );
};

export default LandingPage;

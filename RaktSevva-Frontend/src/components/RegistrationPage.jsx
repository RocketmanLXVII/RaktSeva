import React, { useState } from "react";
import imgLogo from "../assets/rakt.png"; // Ensure the image path is correct
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: ""
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post('http://localhost:3000/api/users/register', {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: formData.role
            });

            if (res.status === 201) {
                alert("Registration Successful");
                navigate("/login");
            }
        } catch (error) {
            console.log("Error in registering:", error);
            console.log(error.status);
            
            if (formData.role === "") {
                setErrorMessage("Please select one of the roles provided!")
            }
            if (error.response && error.response.status == 409) {
                setErrorMessage("User already exists!");
            }
            if (formData.username === "") {
                setErrorMessage("Please provide username!")
            }            
            if (formData.email === "") {
                setErrorMessage("Please provide email!")
            }       
            
        }
    };

    return (
        <div className="flex flex-col max-h-screen min-h-screen bg-red-100">
            {/* Main Content */}
            <div className="flex-grow flex justify-center items-center p-8">
                <div className="w-full max-w-md p-8 bg-white shadow-2xl shadow-red-500 rounded-lg md:max-w-lg lg:max-w-xl">
                    <div className="flex flex-col items-center mb-6 w-full h-full">
                        <img className="h-36 w-36 shadow-lg rounded-3xl shadow-slate-400" src={imgLogo} alt="Rakt Sevva Logo" />
                        <h2 className="text-4xl font-bold text-center text-red-600 mt-4">
                            Rakt<span className="text-black"> Sevva</span>
                        </h2>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="mb-4">
                            <label
                                htmlFor="role"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Register as
                            </label>
                            <select
                                name="role"
                                id="role"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="">Select Role</option>
                                <option value="hospital">Hospital</option>
                                <option value="bloodbank">Blood Bank</option>
                                <option value="camp">Donation Camp</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

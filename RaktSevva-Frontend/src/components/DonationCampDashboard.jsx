import React, { useState, useEffect } from "react";
import { FaChartLine, FaCampground, FaBell, FaSwatchbook, FaIndustry, FaStore } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import imgLogo from "../assets/rakt.png";
import AddToInventoryDC from "./AddToInventoryDC";


const DonationCampDashboard = () => {
    const navigate = useNavigate();

    // Existing states
    const [inventory, setInventory] = useState({
        labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        datasets: [
            {
                label: 'Blood Bags Collected',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    });
    const [notifications, setNotifications] = useState([]);
    const [events, setEvents] = useState([]);

    // New state for form data
    const [formData, setFormData] = useState({
        eventName: "",
        eventStatus:"",
        location: "",
        date: "",
        description: ""
    });

    // Existing functions
    const fetchInventory = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users/camp-getInventoryUpdates");
            const fetchedData = res.data;

            const bloodQuantities = {
                'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0,
            };

            fetchedData.forEach((item) => {
                if (bloodQuantities.hasOwnProperty(item.blood_type)) {
                    bloodQuantities[item.blood_type] = item.quantity;
                }
            });

            setInventory({
                labels: Object.keys(bloodQuantities),
                datasets: [
                    {
                        label: 'Blood Bags Used',
                        data: Object.values(bloodQuantities),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (err) {
            console.error("Error fetching inventory data: ", err);
        }
    };


    const fetchCampEvents = async () => {
        try {
            const result = await axios.get('http://localhost:3000/api/users/camp-getEvents');
            console.log(result.data);

            setEvents(result.data);
        } catch (error) {
            console.error("Error fetching camp events:", error);
        }
    };




    const clearNotifications = () => {
        setNotifications([]);
    };

    const handleLogOut = () => {
        navigate("/");
    };

    // New function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // New function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/users/camp-addEvent', formData);
            alert("Event added successfully!");
            setFormData({
                eventName: "",
                eventStatus: "",
                location: "",
                date: "",
                description: ""
            });
            fetchCampEvents(); // Refresh events after adding
        } catch (error) {
            console.error("Error adding event:", error);
            alert("There was an error adding the event.");
        }
    };
    return (
        <div className="flex flex-col max-h-screen min-h-screen bg-red-100 overflow-x-hidden">
            <header className="p-4 bg-white flex items-center justify-between fixed w-full shadow-xl shadow-red-300 bg-opacity-10 backdrop-blur-lg">
                <div className="flex items-center">
                    <img className="h-12" src={imgLogo} alt="Rakt Sevva Logo" />
                    <h1 className="text-2xl font-bold text-red-600 mx-4 border-l-4 border-l-red-500 pl-3">Donation Camp Dashboard</h1>
                </div>
                <div className=" w-7/12 h-10 flex-col text-center justify-center pt-1">
                    <ul className="flex gap-12 justify-end pl-28 text-2xl font-bold text-red-600 text-center">
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaChartLine /></i>
                            <span>Insights</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaStore /></i>
                            <span>Inventory</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaCampground /></i>
                            <span>Events</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaBell /></i>
                            <span>Notifications</span>
                        </li>
                    </ul>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={handleLogOut}>
                    Logout
                </button>
            </header>

            <div className="flex-grow p-8 flex flex-col md:flex-row md:justify-between mt-20">
                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2">
                    <Bar className='shadow-inner'
                        data={inventory}
                        options={{
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Blood Bags'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Blood Types'
                                    }
                                }
                            }
                        }}
                    />
                    <button onClick={fetchInventory} className="mt-4 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 flex justify-center">
                        Refresh Inventory
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 md:ml-6 mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-red-600 mb-4 text-center">Insights</h2>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        Tracking the blood bags collected from ongoing events helps us evaluate the community's contribution and ensures a steady supply for those in need.
                    </p>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        By targeting regions with higher turnout, we can strategize for upcoming events and increase overall collections effectively.
                    </p>
                </div>
            </div>


            <div className="w-full flex h-[50%] p-8 gap-8">
                <div className='bg-white rounded-2xl w-[50%] p-10 shadow-lg shadow-red-400 flex-col justify-center'>
                    <h2 className="text-4xl font-bold text-red-600 mb-6">Streamline insertion to Inventory</h2>
                    <p className="text-2xl font-semibold">Effortlessly manage and add donated blood to the inventory. With a few clicks, ensure each blood bag is recorded accurately, ready for immediate availability. Simplifying inventory updates allows us to keep our lifesaving supplies well-organized and accessible—making every donation count in real time!   </p>
                </div>
                <AddToInventoryDC />
            </div>


                        
            <div className="w-full flex h-[50%] p-8 gap-8">
                <div className="bg-white rounded-2xl w-[50%] p-10 shadow-lg shadow-red-400 flex-col justify-center">
                    <h2 className="text-4xl font-bold text-red-600 mb-6">Upcoming Events</h2>
                    <div className="h-[80%]">
                    <table className="w-full text-center ">
                        <thead>
                            <tr>
                                <th className="py-2">Event Name</th>
                                <th className="py-2">Date</th>
                                <th className="py-2">Location</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-2">{event.camp_name}</td>
                                    <td className="py-2">{event.date}</td>
                                    <td className="py-2">{event.location}</td>
                                    <td className="py-2">{event.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    
                    <button onClick={fetchCampEvents} className="mb-10 p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 flex justify-center">
                        Refresh Events
                    </button>
                </div>
                <div className='bg-white rounded-2xl w-[50%] p-10 shadow-lg shadow-red-400 flex-col justify-center'>
                    <h2 className="text-4xl font-bold text-red-600 mb-6">Add New Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="eventName">Event Name</label>
                            <input
                                type="text"
                                id="eventName"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                placeholder="Enter Event Name"
                            />
                        </div>
                        <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="eventStatus">Event Status</label>
                                    <select
                                        id="eventStatus"
                                        name="eventStatus"
                                        value={formData.eventStatus}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        
                                    </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                placeholder="Enter Event Location"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="date">Event Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">Event Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                                placeholder="Enter a brief description of the event"
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">
                            Submit Event
                        </button>
                    </form>
                </div>
            </div>






            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">Notifications</h2>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li key={`notification-${index}`} className="border-b py-2 text-red-700">
                                {notification}
                            </li>
                        ))
                    ) : (
                        <li className="py-2 text-green-700">No Notifications</li>
                    )}
                </ul>
                <button
                    onClick={clearNotifications}
                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    Clear Notifications
                </button>
            </div>

            <footer className="bg-white w-full p-5 text-center shadow-md mt-12">
                <p className="text-gray-700">
                    © 2024 Rakt Sevva. All rights reserved. | Designed by GreenApple
                </p>
            </footer>
        </div>
    );
};

export default DonationCampDashboard;

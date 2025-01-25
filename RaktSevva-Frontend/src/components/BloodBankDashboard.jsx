import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import imgLogo from "../assets/rakt.png"; // Ensure the image path is correct
import { FaChartLine, FaHospital, FaBell, FaCampground } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from 'react-chartjs-2'; // Import Chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
const BloodBankDashboard = () => {


    const [notifications, setNotifications] = useState([]); // Notifications for stock alerts



    const [inventory, setInventory] = useState({
        labels: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], // Blood types
        datasets: [
            {
                label: 'Blood Bags Used',
                data: [0, 0, 0, 0, 0, 0, 0, 0], // Initialize with zeros
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Bar color
                borderColor: 'rgba(255, 99, 132, 1)', // Border color
                borderWidth: 1,
            },
        ],
    });


    const fetchInventory = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/users/blood-bank-getInventoryUpdates");
            const fetchedData = res.data;
            console.log("Fetched Data : ", fetchedData);

            const bloodQuantities = {
                'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0,
            };

            // Update blood quantities
            fetchedData.forEach((item) => {
                if (bloodQuantities.hasOwnProperty(item.blood_type)) {
                    bloodQuantities[item.blood_type] = item.quantity;
                }
            });

            // Prepare data for the chart
            setInventory({
                labels: Object.keys(bloodQuantities),
                datasets: [
                    {
                        label: 'Blood Bags Used',
                        data: Object.values(bloodQuantities), // Use values from bloodQuantities
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





    const handleStatusChange = (request_id, newStatus) => {
        try {
            // Update the status on the server (if necessary)
            axios.put(`http://localhost:3000/api/users/bloodbank-updateStatus`, { request_id, newStatus });

            // Update the request state after a successful status change
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.request_id === request_id ? { ...req, status: newStatus } : req
                )
            );

            // Find the specific request that is being updated to notify
            const updatedRequest = requests.find((req) => req.request_id === request_id);

            if (updatedRequest) {
                // Safely add a new notification with the updated request details
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    `${updatedRequest.hospital_name}'s request for ${updatedRequest.blood_type} blood was ${newStatus}.`,
                ]);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };



    const getStatusCircle = (status) => {
        switch (status) {
            case "accepted":
                return <span className="h-4 w-4 bg-green-500 rounded-full inline-block"></span>;
            case "pending":
                return <span className="h-4 w-4 bg-yellow-500 rounded-full inline-block"></span>;
            case "rejected":
                return <span className="h-4 w-4 bg-red-500 rounded-full inline-block"></span>;
            default:
                return null;
        }
    };

    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleLogOut = () => {
        // Add any logout logic here, e.g., clearing user session or tokens
        navigate("/");  // Redirect to the landing page or login
    };



    const clearNotifications = () => {
        setNotifications([]);
    };

    const [requests, setRequests] = useState([]);
    useEffect(() => {
        const fetchHospitalRequests = async () => {
            try {
                const result = await axios.get('http://localhost:3000/api/users/hospital-getHospitalRequest');
                console.log(result);
                const fetchedData = result.data

                setRequests(fetchedData)

            } catch (error) {
                console.error("Error fetching hospital inventory updates:", error);
            }
        }

        // Call the fetch function
        fetchHospitalRequests();

    }, []); // Empty dependency array ensures the effect runs only once, after the component mounts
    const [events, setEvents] = useState([]);
    const fetchCampEvents = async () => {
        try {
            const result = await axios.get('http://localhost:3000/api/users/camp-getEvents');
            console.log(result.data);

            setEvents(result.data);
        } catch (error) {
            console.error("Error fetching camp events:", error);
        }
    };


    return (
        <div className="flex flex-col max-h-screen min-h-screen bg-red-100 overflow-x-hidden">
            <header className="p-4 bg-white flex items-center justify-between fixed w-full shadow-xl shadow-red-300 bg-opacity-10 backdrop-blur-lg">
                <div className="flex items-center">
                    <img className="h-12" src={imgLogo} alt="Rakt Sevva Logo" />
                    <h1 className="text-2xl font-bold text-red-600 mx-4 border-l-4 border-l-red-500 pl-3">BloodBank Dashboard</h1>
                </div>
                <div className=" w-7/12 h-10 flex-col text-center justify-center pt-1">
                    <ul className="flex gap-12 justify-end pl-28 text-2xl font-bold text-red-600 text-ce">
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaChartLine />
                            </i>
                            <span>Insights</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaHospital />
                            </i>
                            <span>Requests</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2"><FaCampground /></i>
                            <span>Events</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <i className="mr-2">
                                <FaBell />
                            </i>
                            <span>Notifications</span>
                        </li>
                    </ul>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={handleLogOut}>
                    Logout
                </button>
            </header>

            {/* Main Dashboard Content */}
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

                {/* Insights Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg md:w-1/2 md:ml-6 mt-6 md:mt-0">
                    <h2 className="text-4xl font-bold text-red-600 mb-4 text-center ">Insights</h2>
                    <p className="text-black-700  text-lg font-semibold p-5">
                        The availability of blood units is crucial for ensuring that hospitals can adequately meet patient needs.
                        As we analyze the current stock, we observe that the most abundant blood type is A+, while O- is relatively low in supply.
                    </p>
                    <p className="text-black-700 text-lg font-semibold p-5">
                        Monitoring blood stocks regularly helps in planning donation drives, ensuring that we maintain a healthy supply
                        of all blood types, especially the rare ones.
                    </p>
                    <p className="text-black-700  text-lg font-semibold p-5">
                        It is essential for blood banks to coordinate with hospitals effectively, especially when requests come in for
                        specific blood types. The status of each request must be updated promptly to avoid shortages.
                    </p>
                </div>
            </div>

            {/* Hospital Requests Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-8">
                <h2 className="text-xl font-bold text-red-600 mb-4">Hospital Requests</h2>
                <table className="w-full text-center">
                    <thead>
                        <tr>
                            <th className="py-2">Hospital</th>
                            <th className="py-2">Blood Type</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Urgency</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.request_id} className="border-t">

                                <td className="py-2">{request.hospital_name}</td>
                                <td className="py-2">{request.blood_type}</td>
                                <td className="py-2">{request.quantity}</td>
                                <td className="py-2">{request.urgency}</td>
                                <td className="py-2">{getStatusCircle(request.status) || getStatusCircle("pending")}</td> {/* Use dynamic status */}
                                <td className="py-2 space-x-2">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "accepted")}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "pending")}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleStatusChange(request.request_id, "rejected")}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="w-full flex justify-center text-center p-5 m-3 min-h-[550px]">
                <div className="bg-white rounded-2xl w-[90%] p-10 shadow-lg shadow-red-400 flex-col justify-center text-center items-center">
                    <h2 className="text-4xl font-bold text-red-600 mb-6">Upcoming Events</h2>
                    <div className="h-[70%] overflow-auto mb-5">
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

                    <div className="flex justify-center text-2xl">
                        <button onClick={fetchCampEvents} className=" p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200 flex justify-center text-center  w-[20%]">
                            Refresh Events
                        </button>
                    </div>

                </div>
            </div>




            {/* Notifications Panel */}
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
            {/* Footer */}
            <footer className="bg-white w-full p-5 text-center shadow-md mt-12">
                <p className="text-gray-700">
                    © 2024 Rakt Sevva. All rights reserved. | Designed by GreenApple
                </p>
            </footer>
        </div>
    );
};

export default BloodBankDashboard;

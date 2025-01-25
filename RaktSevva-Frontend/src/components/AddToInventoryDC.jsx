import React, { useState } from 'react';
import axios from 'axios';

function AddToInventoryDC() {
    const [formData, setFormData] = useState({
        donorName: '',
        bloodType: "",
        quantity: "",
        donationDate: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3000/api/users/camp-addInventory', {
                donorName: formData.donorName,
                bloodType: formData.bloodType,
                quantity: formData.quantity,
                donationDate: formData.donationDate
            });



            if (res.status === 200) {
                alert("Blood bag details added to inventory successfully!");
            }

            setFormData({
                donorName: '',
                bloodType: "",
                quantity: "",
                donationDate: ''
            });
        } catch (error) {
            console.error('Error while storing blood bag details!', error);
        }
    };

    return (
        <div className='bg-white rounded-2xl w-full p-10 shadow-lg shadow-red-400'>
            <h2 className="text-4xl font-bold text-red-600 mb-6">Add Blood Bag to Inventory</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="donorName">Donor Name</label>
                    <input
                        type="text"
                        id="donorName"
                        name="donorName"
                        value={formData.donorName}
                        onChange={handleChange}
                        placeholder="Enter donor name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="bloodType">Blood Type</label>
                    <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="quantity">Quantity (Units)</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter quantity"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="donationDate">Donation Date</label>
                    <input
                        type="date"
                        id="donationDate"
                        name="donationDate"
                        value={formData.donationDate}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">
                    Add to Inventory
                </button>
            </form>
        </div>
    );
}

export default AddToInventoryDC;

import React from 'react'
import axios from 'axios'
import { useState } from 'react'
function PatientUsageForm() {

    const [formData, setFormData] = useState({
        PatientName: '',
        bloodType: 'A+',
        quantity: 0,
        disease: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        

        try{
            const res = await axios.post('http://localhost:3000/api/users/hospital-patient' , {
                patient_name : formData.PatientName,
                blood_type: formData.bloodType,
                quantity : formData.quantity,
                disease : formData.disease
            })

            if(res.status === 200){
                alert("Patient details stored successfully!")
            }

            setFormData({
                patientName: '',
                bloodType: '',
                quantity: '',
                disease: ''
            })

            
        }catch(error){
            console.error('Error while stroing patient details!',error);    
        }

        
    }


    return (
        <div className='bg-white rounded-2xl w-full p-10 shadow-lg shadow-red-400'>
            <h2 className="text-4xl font-bold text-red-600 mb-6">Patient Blood Usage</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="PatientName">Name</label>
                    <input
                        type='text'
                        id="PatientName"
                        name="PatientName"
                        value={formData.PatientName}
                        onChange={handleChange}
                        placeholder='Enter patient name'
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="bloodType">Blood Type</label>
                    <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                    >
                        
                        <option value="">Select Blood Type</option>
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                        placeholder="Enter quantity"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="disease">Disease</label>
                    <input
                        type='text'
                        id="disease"
                        name="disease"
                        value={formData.disease}
                        onChange={handleChange}
                        placeholder='Enter patient disease'
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300"
                    />
                </div>
                <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-200">
                    Submit Details
                </button>
            </form>

        </div>
    )
}

export default PatientUsageForm
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState({ name: '', specialty: '', email: '', hospitalId: '' });
    const [editMode, setEditMode] = useState(false);
    const { user } = useAuth();

    // Specialty options
    const specialties = [
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Pediatrics',
        'Psychiatry',
        'Radiology',
        'Surgery',
        'Orthopedics'
    ];

    useEffect(() => {
        fetchDoctors();
        fetchHospitals();
    }, []);

    const fetchDoctors = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/doctors/view', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const doctorsData = Array.isArray(response.data) ? response.data : [];
                // console.log(doctorsData)
                setDoctors(doctorsData);
            })
            .catch(error => console.error(error));
    };

    const fetchHospitals = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/hospitals/view', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const hospitalsData = Array.isArray(response.data) ? response.data : [];

                setHospitals(hospitalsData);
            })
            .catch(error => console.error(error));
    };

    const handleAddDoctor = () => {
        setCurrentDoctor({ name: '', specialty: '', email: '', hospitalId: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditDoctor = (doctor) => {
        setCurrentDoctor(doctor);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteDoctor = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8080/api/doctors/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchDoctors())
            .catch(error => console.error(error));
    };

    const handleSaveDoctor = () => {
        if (!currentDoctor.hospitalId) {
            alert('Please select a hospital.');
            return;
        }

        const doctor = {
            name: currentDoctor.name,
            specialty: currentDoctor.specialty,
            email: currentDoctor.email,
            hospital: { id: currentDoctor.hospitalId }
        };

        const token = localStorage.getItem('token');
        axios.post('http://localhost:8080/api/doctors/create', doctor, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                fetchDoctors();
                setShowModal(false);
            })
            .catch(error => console.error(error));
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: "71px" }}>
            <Sidebar />
            <div className="container mx-auto mt-10">
                <div className="flex flex-row justify-between px-5">
                    <h2 className="text-2xl font-bold mb-4">Doctors</h2>
                    {user?.role === 'admin' && (
                        <button onClick={handleAddDoctor} className="bg-green-500 text-white p-2 rounded mb-4">
                            Add Doctor
                        </button>
                    )}
                </div>

                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Specialty</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">Hospital</th>
                            {user?.role === 'admin' && <th className="px-4 py-2 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor =>(
                            <tr key={doctor.id} className="border-b">
                                <td className="px-4 py-2 text-center">{doctor.name}</td>
                                <td className="px-4 py-2 text-center">{doctor.specialty}</td>
                                <td className="px-4 py-2 text-center">{doctor.email}</td>
                                <td className="px-4 py-2 text-center">{doctor.hospital.name}</td>
                                {user?.role === 'admin' && (
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleEditDoctor(doctor)} className="bg-blue-500 text-white px-4 py-1 rounded mr-2">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteDoctor(doctor.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Adding/Editing Doctor */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg" style={{ width: '500px' }}>
                            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h3>
                            <input
                                type="text"
                                placeholder="Doctor Name"
                                value={currentDoctor.name}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, name: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <select
                                value={currentDoctor.specialty}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, specialty: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            >
                                <option value="">Select Specialty</option>
                                {specialties.map((specialty, index) => (
                                    <option key={index} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                            <input
                                type="email"
                                placeholder="Email"
                                value={currentDoctor.email}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, email: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <select
                                value={currentDoctor.hospitalId}
                                onChange={(e) => setCurrentDoctor({ ...currentDoctor, hospitalId: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            >
                                <option value="">Select Hospital</option>
                                {hospitals.map(hospital => (
                                    <option key={hospital.id} value={hospital.id}>
                                        {hospital.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end">
                                <button onClick={handleSaveDoctor} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                                    Save
                                </button>
                                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctor;

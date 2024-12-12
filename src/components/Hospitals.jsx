import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Hospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentHospital, setCurrentHospital] = useState({ name: '', address: '' });
    const [editMode, setEditMode] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://hospital-availability-server-production.up.railway.app/api/hospitals/view', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const hospitalsData = Array.isArray(response.data)
                        ? response.data.map(hospital => ({
                            id: hospital.id,
                            name: hospital.name,
                            address: hospital.address
                        }))
                        : [];
                    setHospitals(hospitalsData);
                })
                .catch(error => console.error("Error fetching hospitals:", error));
        } else {
            console.error("Token not found!");
        }
    };




    const handleAddHospital = () => {
        setCurrentHospital({ name: '', address: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditHospital = (hospital) => {
        setCurrentHospital(hospital);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteHospital = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`https://hospital-availability-server-production.up.railway.app/api/hospitals/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                fetchHospitals();
            })
            .catch(error => console.error(error));
    };

    const handleSaveHospital = () => {
        const token = localStorage.getItem('token');
        if (editMode) {
            // Update existing hospital
            axios.put(`https://hospital-availability-server-production.up.railway.app/api/hospitals/${currentHospital.id}`, currentHospital, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchHospitals();
                    setShowModal(false);
                })
                .catch(error => console.error(error));
        } else {
            // Create new hospital
            axios.post('https://hospital-availability-server-production.up.railway.app/api/hospitals/create', currentHospital, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchHospitals();
                    setShowModal(false);
                })
                .catch(error => console.error(error));
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "71px" }}>
            <Sidebar />
            <div className="container mx-auto mt-10">
                <div className='flex flex-row justify-between px-5'>
                    <h2 className="text-2xl font-bold mb-4">Hospitals</h2>
                    {user?.role === 'admin' && (
                        <button onClick={handleAddHospital} className="bg-green-500 text-white p-2 rounded mb-4">
                            Add Hospital
                        </button>
                    )}
                </div>

                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            {/* <th className="px-4 py-2">ID</th> */}
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Address</th>
                            {user?.role === 'admin' && <th className="px-4 py-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map(hospital => (
                            <tr key={hospital.id} className="border-b">
                                {/* <td className="px-4 py-2">{hospital.id}</td> */}
                                <td className="px-4 py-2 text-center">{hospital.name}</td>
                                <td className="px-4 py-2 text-center">{hospital.address}</td>
                                {user?.role === 'admin' && (
                                    <td className="px-4 py-2 flex justify-center">
                                        <button onClick={() => handleEditHospital(hospital)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                                        <button onClick={() => handleDeleteHospital(hospital.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Adding/Editing Hospital */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg">
                            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Hospital' : 'Add Hospital'}</h3>
                            <input
                                type="text"
                                placeholder="Hospital Name"
                                value={currentHospital.name}
                                onChange={(e) => setCurrentHospital({ ...currentHospital, name: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <input
                                type="text"
                                placeholder="Hospital Address"
                                value={currentHospital.address}
                                onChange={(e) => setCurrentHospital({ ...currentHospital, address: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <div className="flex justify-end">
                                <button onClick={handleSaveHospital} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
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

export default Hospitals;

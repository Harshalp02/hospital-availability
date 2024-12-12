import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Bed = () => {
    const [beds, setBeds] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentBed, setCurrentBed] = useState({ bedNumber: '', available: true, hospitalId: '', numberOfBeds: 1 });
    const [editMode, setEditMode] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchBeds();
        fetchHospitals();
    }, []);

    const fetchBeds = () => {
        const token = localStorage.getItem('token');
        axios.get('https://hospital-availability-server-production.up.railway.app/api/beds/view', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setBeds(response.data || []);
            })
            .catch(error => console.error('Error fetching beds:', error));
    };

    const fetchHospitals = () => {
        const token = localStorage.getItem('token');
        axios.get('https://hospital-availability-server-production.up.railway.app/api/hospitals/view', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setHospitals(response.data || []);
            })
            .catch(error => console.error('Error fetching hospitals:', error));
    };

    const handleAddBed = () => {
        setCurrentBed({ bedNumber: '', available: true, hospitalId: '', numberOfBeds: 1 });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditBed = (bed) => {
        setCurrentBed(bed);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteBed = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`https://hospital-availability-server-production.up.railway.app/api/beds/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => fetchBeds())
            .catch(error => console.error('Error deleting bed:', error));
    };

    const handleSaveBed = () => {
        if (!currentBed.hospitalId) {
            alert('Please select a hospital.');
            return;
        }

        const bed = {
            bedNumber: currentBed.bedNumber,
            available: currentBed.available,
            numberOfBeds: currentBed.numberOfBeds,
            hospital: { id: currentBed.hospitalId }
        };

        const token = localStorage.getItem('token');
        if (editMode) {
            axios.put(`https://hospital-availability-server-production.up.railway.app/api/beds/update/${currentBed.id}`, bed, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchBeds();
                    setShowModal(false);
                })
                .catch(error => console.error('Error updating bed:', error));
        } else {
            axios.post('https://hospital-availability-server-production.up.railway.app/api/beds/create', bed, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    fetchBeds();
                    setShowModal(false);
                })
                .catch(error => console.error('Error adding bed:', error));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: "71px" }}>
            <Sidebar />
            <div className="container mx-auto mt-10">
                <div className={`flex flex-row px-5 ${user?.role === 'admin' ? 'justify-between' : 'justify-center'}`}>
                    <h2 className="text-2xl font-bold mb-4">Beds</h2>
                    {user?.role === 'admin' && (
                        <button onClick={handleAddBed} className="bg-green-500 text-white p-2 rounded mb-4">
                            Add Bed
                        </button>
                    )}
                </div>

                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-center">Department Number</th>
                            <th className="px-4 py-2 text-center">Number of Beds</th>
                            <th className="px-4 py-2 text-center">Availability</th>
                            <th className="px-4 py-2 text-center">Hospital</th>
                            {user?.role === 'admin' && <th className="px-4 py-2 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {beds.map(bed => (
                            <tr key={bed.id} className="border-b">
                                <td className="px-4 py-2 text-center">{bed.bedNumber}</td>
                                <td className="px-4 py-2 text-center">{bed.numberOfBeds}</td>
                                <td className="px-4 py-2 text-center">{bed.available ? 'Available' : 'Occupied'}</td>
                                <td className="px-4 py-2 text-center">{bed.hospital.name}</td>
                                {user?.role === 'admin' && (
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleEditBed(bed)} className="bg-blue-500 text-white px-4 py-1 rounded mr-2">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteBed(bed.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal for Adding/Editing Bed */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                        <div className="bg-white p-5 rounded shadow-lg" style={{ width: '500px' }}>
                            <h3 className="text-xl font-bold mb-4">{editMode ? 'Edit Bed' : 'Add Bed'}</h3>
                            <input
                                type="text"
                                placeholder="Department Number"
                                value={currentBed.bedNumber}
                                onChange={(e) => setCurrentBed({ ...currentBed, bedNumber: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <input
                                type="number"
                                placeholder="Number of Beds"
                                value={currentBed.numberOfBeds}
                                onChange={(e) => setCurrentBed({ ...currentBed, numberOfBeds: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            />
                            <select
                                value={currentBed.hospitalId}
                                onChange={(e) => setCurrentBed({ ...currentBed, hospitalId: e.target.value })}
                                className="block w-full mb-4 p-2 border"
                            >
                                <option value="">Select Hospital</option>
                                {hospitals.map(hospital => (
                                    <option key={hospital.id} value={hospital.id}>
                                        {hospital.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={currentBed.available}
                                    onChange={(e) => setCurrentBed({ ...currentBed, available: e.target.checked })}
                                    className="mr-2"
                                />
                                <label>Available</label>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleSaveBed} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
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

export default Bed;

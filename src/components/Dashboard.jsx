import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        axios.get("https://hospital-availability-server-production.up.railway.app/api/hospitals/view")
            .then(response => setHospitals(response.data))
            .catch(error => console.error("There was an error fetching hospital data", error));
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "71px" }}>
            <Sidebar />
            <div className="dashboard flex-1 p-4">
                <h2 className="text-2xl font-bold mb-4 pl-4 pt-4">Hospital Dashboard</h2>
                <div className="flex flex-row">

                    {hospitals.length === 0 ? (
                        <p className="text-xl mb-4">No hospitals available</p>
                    ) : (
                        hospitals.map((hospital) => (
                            <div
                                key={hospital.id}
                                className="hospital-card p-4 m-4 bg-white rounded shadow-2xl"
                                style={{ minHeight: "465px", minWidth: "384px" }}
                            >
                                <h3 className="font-bold text-lg">{hospital.name}</h3>
                                <p>{hospital.address}</p>

                                {/* Doctors Table */}
                                <h4 className="mt-4 text-md font-semibold">Doctors:</h4>
                                <table className="min-w-full table-auto border-collapse mt-2">
                                    <thead>
                                        <tr>
                                            <th className="border-b px-4 py-2">Name</th>
                                            <th className="border-b px-4 py-2">Specialty</th>
                                            <th className="border-b px-4 py-2">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospital.doctors.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center px-4 py-2">No doctors available</td>
                                            </tr>
                                        ) : (
                                            hospital.doctors.map((doctor) => (
                                                <tr key={doctor.id}>
                                                    <td className="border-b px-4 py-2">{doctor.name}</td>
                                                    <td className="border-b px-4 py-2">{doctor.specialty}</td>
                                                    <td className="border-b px-4 py-2">{doctor.email}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* Beds Table */}
                                <h4 className="mt-4 text-md font-semibold">Beds:</h4>
                                <table className="min-w-full table-auto border-collapse mt-2">
                                    <thead>
                                        <tr>
                                            <th className="border-b px-4 py-2">Bed Number</th>
                                            <th className="border-b px-4 py-2">Available</th>
                                            <th className="border-b px-4 py-2">Number of Beds</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hospital.beds.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center px-4 py-2">No beds available</td>
                                            </tr>
                                        ) : (
                                            hospital.beds.map((bed) => (
                                                <tr key={bed.id}>
                                                    <td className="border-b px-4 py-2">{bed.bedNumber}</td>
                                                    <td className="border-b px-4 py-2">{bed.available ? 'Yes' : 'No'}</td>
                                                    <td className="border-b px-4 py-2">{bed.numberOfBeds}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

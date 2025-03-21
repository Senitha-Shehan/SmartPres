import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../../lib/axios";

const StudentPresentation = () => {
    const location = useLocation();
    const { username } = location.state || {}; // Get username from location state
    
    const [studentGroups, setStudentGroups] = useState([]); // To store multiple groups/modules the student is part of
    const [presentations, setPresentations] = useState([]); // Store presentations for the modules

    useEffect(() => {
        if (username) {
            fetchStudentGroups(username);
        }
    }, [username]);

    // Fetch groups for the student (modules they're registered for)
    const fetchStudentGroups = async (studentId) => {
        try {
            const response = await api.get(`/api/groups/student/${studentId}`);
            if (response.data && response.data.length > 0) {
                setStudentGroups(response.data); // Set student groups (multiple modules)
                fetchPresentations(response.data); // Fetch presentations for each module
            } else {
                setStudentGroups([]); // No groups found for this student
            }
        } catch (error) {
            console.error("Error fetching student groups:", error.response?.data || error.message);
        }
    };

    // Fetch presentations for each module the student is part of
    const fetchPresentations = async (groups) => {
        try {
            const allPresentations = [];
            for (let group of groups) {
                const response = await api.get(`/api/presentations/module/${group.moduleName}`);
                allPresentations.push(...response.data); // Combine presentations of all modules
            }
            setPresentations(allPresentations); // Set all presentations
        } catch (error) {
            console.error("Error fetching presentations:", error.response?.data || error.message);
        }
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white p-8 shadow-lg rounded-lg border border-gray-300">
                {/* Welcome Message */}
                <h1 className="text-3xl font-bold mb-6 text-gray-900 text-left">{`Welcome, ${username}!`}</h1>

                {studentGroups.length > 0 ? (
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Your Presentations</h2>
                        {studentGroups.map((group) => (
                            <div key={group.groupId} className="mb-8 bg-gray-50 p-6 rounded-lg shadow">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Module: {group.moduleName}</h3>

                                {presentations.length > 0 ? (
                                    <table className="w-full border-collapse shadow-md rounded-lg bg-white">
                                        <thead className="bg-blue-600 text-white">
                                            <tr>
                                                <th className="border-b-2 border-gray-300 p-3 text-left">Date</th>
                                                <th className="border-b-2 border-gray-300 p-3 text-left">Examiner</th>
                                                <th className="border-b-2 border-gray-300 p-3 text-left">Duration (mins)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {presentations.filter(presentation => presentation.module === group.moduleName).map((presentation) => (
                                                <tr key={presentation._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                    <td className="p-3">{new Date(presentation.date).toLocaleDateString()}</td>
                                                    <td className="p-3">{presentation.examiner}</td>
                                                    <td className="p-3">{presentation.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-700">No scheduled presentations for this module.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-700">You are not registered in any groups.</p>
                )}
            </div>
        </div>
    );
};

export default StudentPresentation;

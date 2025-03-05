import { useState, useEffect } from "react";

const ExaminerAdmin = () => {
    const [examiners, setExaminers] = useState([]);

    useEffect(() => {
        fetchExaminers();
    }, []);

    const fetchExaminers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/examiners");
            const data = await response.json();
            setExaminers(data);
        } catch (error) {
            console.error("Error fetching examiners:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Examiner List</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Examiner ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Module</th>
                        <th className="border p-2">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {examiners.length > 0 ? (
                        examiners.map((examiner) => (
                            <tr key={examiner._id} className="text-center">
                                <td className="border p-2">{examiner.examinerID}</td>
                                <td className="border p-2">{examiner.name}</td>
                                <td className="border p-2">{examiner.module}</td>
                                <td className="border p-2">{examiner.email}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border p-2 text-center">
                                No examiners found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExaminerAdmin;

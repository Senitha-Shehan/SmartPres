import { useState, useEffect } from "react";
import api from "../../lib/axios";

const ExaminerAdmin = () => {
    const [examiners, setExaminers] = useState([]);
    const [formData, setFormData] = useState({
        examinerID: "",
        name: "",
        module: "",
        email: "",
    });

    useEffect(() => {
        fetchExaminers();
    }, []);

    const fetchExaminers = async () => {
        try {
            const response = await api.get("/api/examiners");
            setExaminers(response.data);
        } catch (error) {
            console.error("Error fetching examiners:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/examiners", formData); // Send POST request to add examiner
            fetchExaminers(); // Re-fetch the examiners list after adding
            setFormData({
                examinerID: "",
                name: "",
                module: "",
                email: "",
            }); // Reset the form
        } catch (error) {
            console.error("Error adding examiner:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold mb-4">Examiner List</h2>

            {/* Form to add a new examiner */}
            <form onSubmit={handleSubmit} className="mb-4">
                <h3 className="text-lg font-semibold">Add New Examiner</h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Examiner ID</label>
                    <input
                        type="text"
                        name="examinerID"
                        value={formData.examinerID}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Module</label>
                    <input
                        type="text"
                        name="module"
                        value={formData.module}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Examiner
                </button>
            </form>

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

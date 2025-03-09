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
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);

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
            if (editId) {
                await api.put(`/api/examiners/${editId}`, formData);
                setMessage("Examiner updated successfully");
            } else {
                await api.post("/api/examiners", formData);
                setMessage("Examiner added successfully");
            }
            setFormData({
                examinerID: "",
                name: "",
                module: "",
                email: "",
            });
            setEditId(null);
            fetchExaminers();
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong");
        }
    };

    const handleEdit = (examiner) => {
        setFormData(examiner);
        setEditId(examiner._id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/examiners/${id}`);
            setMessage("Examiner deleted successfully");
            fetchExaminers();
        } catch (error) {
            console.error("Error deleting examiner:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-25 p-8 bg-white shadow-lg rounded-lg border border-gray-300">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                {editId ? "Edit Examiner" : "Add Examiner"}
            </h2>
            <h1>Matheesha</h1>
            {message && <p className="mb-4 text-green-600 font-medium text-center">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="examinerID"
                        placeholder="Examiner ID"
                        value={formData.examinerID}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg bg-gray-100"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="module"
                        placeholder="Module"
                        value={formData.module}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg bg-gray-100"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg bg-gray-100"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition duration-300"
                >
                    {editId ? "Update Examiner" : "Add Examiner"}
                </button>
            </form>

            <h3 className="text-2xl font-semibold mt-10 text-center">Examiner List</h3>
            <div className="overflow-x-auto mt-6">
                <table className="table w-full border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-blue-100">
                            <th></th>
                            <th>Examiner ID</th>
                            <th>Name</th>
                            <th>Module</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examiners.map((examiner, index) => (
                            <tr key={examiner._id} className="hover:bg-gray-100 transition duration-200">
                                <th>{index + 1}</th>
                                <td className="text-center">{examiner.examinerID}</td>
                                <td className="text-center">{examiner.name}</td>
                                <td className="text-center">{examiner.module}</td>
                                <td className="text-center">{examiner.email}</td>
                                <td className="text-center flex justify-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(examiner)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition duration-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(examiner._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition duration-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExaminerAdmin;

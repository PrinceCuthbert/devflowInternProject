import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Users } from 'lucide-react';
import { apiService } from '../service/apiService';

function AdminDashboard({ onBack }) {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await apiService.getUsers();
                setUsersList(data);
            } catch (err) {
                setError("Access Denied. You do not have permission to view this data.");
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f5f8] flex flex-col items-center py-10 px-6 font-sans">
            <div className="bg-white w-full max-w-[850px] rounded-[24px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">System Access Logs</h1>
                            <p className="text-sm text-gray-400 font-medium mt-1">Authorized Personnel Only</p>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-violet-600 transition-colors bg-gray-50 hover:bg-violet-50 px-4 py-2 rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Projects
                    </button>
                </div>

                {/* Content Section */}
                {loading ? (
                    <p className="text-center text-gray-400 py-10 italic">Loading secure data...</p>
                ) : error ? (
                    <p className="text-center text-red-500 bg-red-50 py-4 rounded-xl font-medium">{error}</p>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-[#f9fafb] text-gray-500 text-sm border-b border-gray-100">
                                <th className="py-4 px-6 font-semibold">User ID</th>
                                <th className="py-4 px-6 font-semibold">Username</th>
                                <th className="py-4 px-6 font-semibold">Security Clearance</th>
                                <th className="py-4 px-6 font-semibold">Join Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usersList.map((u) => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400 text-sm">#{u.id}</td>
                                    <td className="py-4 px-6 text-gray-800 font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-300" /> {u.username}
                                    </td>
                                    <td className="py-4 px-6">
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider
                                                ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {u.role}
                                            </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 text-sm">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
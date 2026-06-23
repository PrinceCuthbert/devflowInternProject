import React, { useState, useEffect } from 'react';
import useTodos from '../hooks/useTodos';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import TrashBucket from '../components/TrashBucket';

import { useAuth } from '../auth/AuthProvider';

function Dashboard({ onNavigateAdmin }) {
// 1. Grab toggleTaskStatus from the hook
    const { tasks, loading, editingId, setEditingId, saveTask, removeTask, toggleTaskStatus } = useTodos();
    const [inputValue, setInputValue] = useState('');
    const { user, logout } = useAuth();

    // Sync input value when editingId changes
    useEffect(() => {
        if (editingId) {
            const taskToEdit = tasks.find(t => t.id === editingId);
            if (taskToEdit) setInputValue(taskToEdit.name);
        } else {
            setInputValue('');
        }
    }, [editingId, tasks]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        saveTask(inputValue.trim());
        setInputValue('');
    };

    return (
        <div className="min-h-screen bg-[#f4f5f8] flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-[850px] rounded-[24px] p-10 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row gap-10 items-start">

                    <div className="flex-1 w-full">

                        {/* --- UPDATED HEADER SECTION --- */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                                PROJECT REPO <span className="px-3 py-1 bg-violet-100 text-violet-700 text-sm rounded-full">{tasks.length}</span>
                            </h1>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">
                                    Welcome, <span className="text-violet-600 font-bold">{user.username}</span>
                                </span>

                                {/* The Secret Admin Button */}
                                {user.role === 'admin' && (
                                    <button
                                        onClick={onNavigateAdmin}
                                        className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-bold hover:bg-red-200 transition-colors tracking-wide"
                                    >
                                        ADMIN PANEL
                                    </button>
                                )}

                                <button onClick={logout} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                                    Logout
                                </button>
                            </div>
                        </div>
                        {/* ------------------------------ */}

                        {/* Look how clean this is now! */}
                        <TaskInput
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            onSubmit={handleSubmit}
                            isEditing={!!editingId}
                        />

                        <TaskList
                            tasks={tasks}
                            loading={loading}
                            editingId={editingId}
                            onEdit={(t) => setEditingId(t.id)}
                            onDelete={removeTask}
                            onToggle={toggleTaskStatus}
                        />
                    </div>

                    <div className="w-full md:w-[180px] shrink-0 pt-1">
                        <TrashBucket onDropTask={removeTask} />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
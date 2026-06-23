import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../service/apiService';
import { useAuth } from '../auth/AuthProvider';
import { io } from 'socket.io-client';

function useTodos() {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.getAll();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user, loadTasks]);

    // 🔌 REAL-TIME EVENT PIPELINE EFFECT
    useEffect(() => {
        if (!user) return;

        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log("⚡ Connected to WebSocket Server! ID:", socket.id);
        });

        // Listener A: Task Created
        socket.on('project_created', (newProject) => {
            console.log("📡 Broadcast Received: project_created", newProject);
            // Loose comparison (==) handles string vs integer differences safely
            if (newProject.userId == user.id) {
                setTasks((prevTasks) => {
                    // Cleanly filter out any potential duplicate by ID to be safe
                    const filtered = prevTasks.filter(t => t.id != newProject.id);
                    // Return a brand new array reference to force React to update the DOM
                    return [...filtered, newProject];
                });
            }
        });

        // Listener B: Task Updated
        socket.on('project_updated', (updatedProject) => {
            console.log("📡 Broadcast Received: project_updated", updatedProject);
            if (updatedProject.userId == user.id) {
                setTasks((prevTasks) =>
                    prevTasks.map((t) => (t.id == updatedProject.id ? updatedProject : t))
                );
            }
        });

        // Listener C: Task Deleted
        socket.on('project_deleted', ({ id, userId }) => {
            console.log("📡 Broadcast Received: project_deleted. ID:", id);
            if (userId == user.id) {
                setTasks((prevTasks) => prevTasks.filter((t) => t.id != id));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const saveTask = async (name) => {
        if (editingId) {
            // 1. Find the current task to make sure we don't drop its status row
            const currentTask = tasks.find(t => t.id == editingId);
            const currentStatus = currentTask ? currentTask.status : 'pending';

            // Pass all 3 parameters down safely!
            await apiService.update(editingId, name, currentStatus);
            setEditingId(null);
        } else {
            await apiService.create(name);
        }
        // No loadTasks() needed! Sockets manage the array updates.
    };

    const removeTask = async (id) => {
        await apiService.delete(id);
        if (editingId === id) setEditingId(null);
    };

    const toggleTaskStatus = async (task) => {
        try {
            // 2. Make absolutely sure nextStatus can NEVER fall back to a blank string
            const nextStatus = task.status === 'completed' ? 'pending' : 'completed';

            // 🛑 ADD THIS TEMP LOG LINE:
            console.log("✈️ Sending to Axios -> ID:", task.id, "Name:", task.name, "Status:", nextStatus);

            // Push all parameters explicitly
            await apiService.update(task.id, task.name, nextStatus);
        } catch (error) {
            console.error("Failed to toggle status:", error);
        }
    };

// Add toggleTaskStatus to your return object at the bottom!
    return { tasks, loading, editingId, setEditingId, saveTask, removeTask, toggleTaskStatus };

}

export default useTodos;
import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, loading, editingId, onEdit, onDelete,onToggle }) {
    if (loading) {
        return <p className="text-center text-gray-400 py-10 italic">Loading tasks...</p>;
    }

    if (tasks.length === 0) {
        return <p className="text-center text-gray-400 py-10 font-medium">All caught up! Add a project above.</p>;
    }

    return (
        <ul className="m-0 p-0">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingId === task.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            ))}
        </ul>
    );
}

export default TaskList;
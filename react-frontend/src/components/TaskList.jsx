import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  loading,
  error,
  editingId,
  onEdit,
  onDelete,
  onToggle,
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-400 py-10 italic">Loading tasks...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-10 font-medium">{error}</p>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-400 py-10 font-medium">
        All caught up! Add a project above.
      </p>
    );
  }

  return (
    <ul className="m-0 p-0">
      {tasks.map((task) => (
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

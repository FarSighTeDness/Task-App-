import { useState } from "react";
import PropTypes from "prop-types";

export default function TaskList({ tasks, setTasks }) {
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", emailid: "", task: "" });

  const handleView = (id) => {
    setViewingId((prev) => (prev === id ? null : id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({ name: task.name, emailid: task.emailid, task: task.task });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", emailid: "", task: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setViewingId(id);
      cancelEdit();
    } catch (err) {
      console.error("Update task failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));

      if (viewingId === id) {
        setViewingId(null);
      }

      if (editingId === id) {
        cancelEdit();
      }
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="border-b py-2">
          <div className="flex justify-between items-center gap-2">
            <p className="font-semibold">{task.name}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleView(task.id)}
                className="bg-slate-600 text-white px-3 py-1 rounded"
              >
                {viewingId === task.id ? "Hide" : "View"}
              </button>
              <button
                onClick={() => startEdit(task)}
                className="bg-amber-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>

          {viewingId === task.id && editingId !== task.id && (
            <div className="mt-2 text-sm text-gray-700">
              <p><span className="font-medium">Email:</span> {task.emailid}</p>
              <p><span className="font-medium">Task:</span> {task.task}</p>
            </div>
          )}

          {editingId === task.id && (
            <div className="mt-3 bg-gray-50 p-3 rounded border">
              <input
                className="border p-2 w-full mb-2"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                value={editForm.emailid}
                onChange={(e) => setEditForm((prev) => ({ ...prev, emailid: e.target.value }))}
              />
              <input
                className="border p-2 w-full mb-3"
                placeholder="Task"
                value={editForm.task}
                onChange={(e) => setEditForm((prev) => ({ ...prev, task: e.target.value }))}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      emailid: PropTypes.string,
      task: PropTypes.string,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
};

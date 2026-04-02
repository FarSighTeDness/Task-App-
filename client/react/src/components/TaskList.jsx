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
      const res = await fetch(`/tasks/${id}`, {
        method: "PUT",
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
      const res = await fetch(`/tasks/${id}`, { method: "DELETE" });

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
    <div className="p-4 bg-white rounded shadow">
      <h2 className="mb-2 text-lg font-bold">Tasks</h2>
      {tasks.map((task, index) => (
        <div key={task.id} className="py-2 border-b">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold">
              <span className="mr-2 text-gray-500">{index + 1}.</span>
              {task.name}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleView(task.id)}
                className="px-3 py-1 text-white rounded bg-slate-600"
              >
                {viewingId === task.id ? "Hide" : "View"}
              </button>
              <button
                onClick={() => startEdit(task)}
                className="px-3 py-1 text-white rounded bg-amber-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 text-white bg-red-500 rounded"
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
            <div className="p-3 mt-3 border rounded bg-gray-50">
              <input
                className="w-full p-2 mb-2 border"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <input
                className="w-full p-2 mb-2 border"
                placeholder="Email"
                value={editForm.emailid}
                onChange={(e) => setEditForm((prev) => ({ ...prev, emailid: e.target.value }))}
              />
              <input
                className="w-full p-2 mb-3 border"
                placeholder="Task"
                value={editForm.task}
                onChange={(e) => setEditForm((prev) => ({ ...prev, task: e.target.value }))}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  className="px-3 py-1 text-white bg-green-600 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 text-white bg-gray-400 rounded"
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

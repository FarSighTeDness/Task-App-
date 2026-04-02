
import { useState } from "react";
import PropTypes from "prop-types";

export default function TaskForm({ setTasks }) {
  const [form, setForm] = useState({ name: "", emailid: "", task: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setForm({ name: "", emailid: "", task: "" });
    } catch (err) {
      setError("Could not save task. Ensure the API server is running on port 3000.");
      console.error("Create task failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Email"
        value={form.emailid}
        onChange={(e) => setForm({ ...form, emailid: e.target.value })}
      />
      <input
        className="w-full p-2 mb-2 border"
        placeholder="Task"
        value={form.task}
        onChange={(e) => setForm({ ...form, task: e.target.value })}
      />
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <button
        disabled={submitting}
        className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}

TaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
};

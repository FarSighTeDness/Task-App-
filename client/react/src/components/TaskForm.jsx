
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
      const res = await fetch("http://localhost:3000/tasks", {
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
      setError("Could not save task. Ensure API server is running on http://localhost:3000.");
      console.error("Create task failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.emailid}
        onChange={(e) => setForm({ ...form, emailid: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Task"
        value={form.task}
        onChange={(e) => setForm({ ...form, task: e.target.value })}
      />
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}

TaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
};

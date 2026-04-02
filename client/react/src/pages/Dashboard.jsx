import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setLoadError("");

    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        setLoadError("Could not load tasks. Start API server on http://localhost:3000.");
        console.error("Load tasks failed:", err);
      });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      {loadError && <p className="text-sm text-red-600 col-span-2">{loadError}</p>}
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

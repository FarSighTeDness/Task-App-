
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:300/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

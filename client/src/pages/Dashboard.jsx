import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoadError("");

    fetch("/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        setLoadError("Could not load tasks. Ensure the API server is running on port 3000.");
        console.error("Load tasks failed:", err);
      });
  }, []);

  const openMenu = (menu) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
  };

  const recentTasks = tasks.length > 0 ? [tasks[tasks.length - 1]] : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm md:hidden">
        <span className="w-9" />
        <h1 className="text-base font-bold text-slate-800">Task Dashboard</h1>
        <span className="w-9" />
      </header>

      <button
        type="button"
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="fixed left-0 top-1/2 z-40 -translate-y-1/2 px-3 py-2 bg-white border border-l-0 shadow rounded-r-md border-slate-400"
        aria-label="Open and close menu"
      >
        <span className="block h-0.5 w-5 bg-slate-700" />
        <span className="mt-1 block h-0.5 w-5 bg-slate-700" />
        <span className="mt-1 block h-0.5 w-5 bg-slate-700" />
        <span className="block mt-2 text-xs font-semibold text-slate-700">
          {sidebarOpen ? "Close" : "Open"}
        </span>
      </button>

      <div className="flex mx-auto max-w-7xl">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-30 h-full w-64 bg-slate-900 p-4 text-slate-100 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <h2 className="mt-2 mb-6 text-lg font-semibold">Menu</h2>
          <nav className="space-y-2">
            <button
              type="button"
              onClick={() => openMenu("dashboard")}
              className={`w-full rounded px-3 py-2 text-left ${
                activeMenu === "dashboard" ? "bg-cyan-600 text-white" : "bg-slate-800"
              }`}
            >
              Task Dashboard
            </button>
            <button
              type="button"
              onClick={() => openMenu("add")}
              className={`w-full rounded px-3 py-2 text-left ${
                activeMenu === "add" ? "bg-cyan-600 text-white" : "bg-slate-800"
              }`}
            >
              Task Add
            </button>
          </nav>
        </aside>

        <main className="w-full p-4 md:p-6">
          {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}

          {activeMenu === "dashboard" && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-800">Task Dashboard</h2>
              <TaskList tasks={tasks} setTasks={setTasks} />
            </section>
          )}

          {activeMenu === "add" && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-800">Task Add</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-700">Add New Task</h3>
                  <TaskForm setTasks={setTasks} />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-700">Recently Added User</h3>
                  <TaskList tasks={recentTasks} setTasks={setTasks} />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

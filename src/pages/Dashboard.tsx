import { useEffect, useState } from "react";
import { createTask, getTasks, deleteTask, updateTask, uploadAttachment,} from "../services/taskService";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const [editCategory, setEditCategory] = useState("Personal");
  const [attachment, setAttachment] = useState<File | null>(null);
 

const loadTasks = async () => {
  try {
    const data = await getTasks();
    setTasks(data);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    loadTasks();
  }, []);

useEffect(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);

useEffect(() => {
  checkNotifications();

  const interval = setInterval(() => {
    checkNotifications();
  }, 60000);

  return () => clearInterval(interval);
}, [tasks]);

 const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
      let fileName = "";

      if (attachment) {
      const upload = await uploadAttachment(attachment);
      fileName = upload.filename;
    }

    await createTask({
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
      priority: editPriority,
      category: editCategory,
      attachment: fileName,
    });

    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
    setEditPriority("Medium");
    setEditingId("");
    setEditCategory("Personal");
    setAttachment(null);
    await loadTasks();

    alert("Task Added Successfully");
  } catch (error) {
    alert("Failed to Add Task");
  }
};

const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTask(id);

    alert("Task Deleted Successfully");

    await loadTasks();
  } catch (error) {
    alert("Failed to Delete Task");
  }
};

const handleComplete = async (task: any) => {
  try {
    await updateTask(task._id, {
      ...task,
      status: "Completed",
    });

    alert("Task Completed!");

    await loadTasks();
  } catch (error) {
    console.error(error);
    alert("Failed to Update Task");
  }
};

const handleEdit = (task: any) => {
  setEditingId(task._id);
  setEditTitle(task.title);
  setEditDescription(task.description);
  setEditDueDate(task.dueDate.split("T")[0]);
  setEditPriority(task.priority);
  setEditCategory(task.category);
};

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await updateTask(editingId, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate,
      priority: editPriority,
    });

    alert("Task Updated Successfully");

    setEditingId("");
    setEditTitle("");
    setEditDescription("");
    setEditDueDate("");
    setEditPriority("Medium");

    await loadTasks();
  } catch (error) {
    console.error(error);
    alert("Failed to Update Task");
  }
};

const filteredTasks = tasks
.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || task.status === filter;

  return matchesSearch && matchesFilter;
})

  .sort((a, b) => {
      if (sortBy === "Due Date") {
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      if (sortBy === "Priority") {
        const priorityOrder: any = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });


const today = new Date();
today.setHours(0, 0, 0, 0);

const isOverdue = (date: string, status: string) => {
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  return due < today && status !== "Completed";
};

const isToday = (date: string) => {
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  return due.getTime() === today.getTime();
};

 const totalTasks = tasks.length;

const pendingTasks = tasks.filter(
  (task) => task.status === "Pending"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "Completed"
).length;

const overdueTasks = tasks.filter(
  (task) => isOverdue(task.dueDate, task.status)
).length;

const progress =
  tasks.length === 0
    ? 0
    : Math.round((completedTasks / tasks.length) * 100);

const chartData = {
  labels: ["Completed", "Pending"],

  datasets: [
    {
      data: [
        completedTasks,
        tasks.length - completedTasks,
      ],

      backgroundColor: [
        "#22c55e",
        "#ef4444",
      ],
    },
  ],
};

const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Smart Time Scheduler", 14, 20);

  autoTable(doc, {
    head: [["Title", "Priority", "Status", "Due Date"]],
    body: tasks.map((task) => [
      task.title,
      task.priority,
      task.status,
      new Date(task.dueDate).toLocaleDateString(),
    ]),
    startY: 30,
  });

  doc.save("Tasks.pdf");
};

  const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    tasks.map((task) => ({
      Title: task.title,
      Description: task.description,
      Priority: task.priority,
      Status: task.status,
      "Due Date": new Date(task.dueDate).toLocaleDateString(),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  XLSX.writeFile(workbook, "Tasks.xlsx");
};

  const checkNotifications = () => {
  tasks.forEach((task) => {
    const today = new Date().toDateString();
    const due = new Date(task.dueDate).toDateString();

    if (
      due === today &&
      task.status !== "Completed" &&
      Notification.permission === "granted"
    ) {
      new Notification("📅 Task Reminder", {
        body: `${task.title} is due today!`,
      });
    }
  });
};

  return (

       <div
        className={`min-h-screen ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100"
        }`}
      >

      {/* Navbar */}

<nav
  className={`shadow-md ${
    darkMode ? "bg-gray-800 text-white" : "bg-white"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex justify-between items-start">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        Smart Time Scheduler
      </h1>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-end gap-3">

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Profile
        </button>

        <button
          onClick={() => navigate("/kanban")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
          Kanban
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  </div>
</nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <h2 className="text-3xl font-bold mb-8">
          Dashboard
        </h2>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-blue-500 text-white rounded-xl p-6 shadow-lg">

          <h3 className="text-lg font-semibold">
            Total Tasks
          </h3>

          <p className="text-3xl sm:text-5xl font-bold mt-3">
            {totalTasks}
          </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">

          <h3 className="text-sm sm:text-lg font-semibold">
            Completed
          </h3>

          <p className="text-3xl sm:text-5xl font-bold mt-3">
            {completedTasks}
          </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">

          <h3 className="text-sm sm:text-lg font-semibold">
            Pending
          </h3>

          <p className="text-3xl sm:text-5xl font-bold mt-3">
            {pendingTasks}
          </p>

          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">

          <h3 className="text-sm sm:text-lg font-semibold">
            Overdue
          </h3>

          <p className="text-3xl sm:text-5xl font-bold mt-3 text-red-600">
            {overdueTasks}
          </p>

        </div>

        </div>

        {/* Task Progress */}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold">
            Task Progress
          </h3>

          <span className="font-bold">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">

        <h2 className="text-2xl font-bold mb-5">
          Task Statistics
        </h2>

        <div className="w-72 mx-auto">
          <Pie data={chartData} />
        </div>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">

        <h2 className="text-2xl font-bold mb-5">
          Calendar
        </h2>

        <Calendar
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date)}
        />

      </div>

      <h3 className="text-xl font-bold mt-6 mb-3">
      Tasks on {selectedDate.toLocaleDateString()}
    </h3>

    {tasks
      .filter(
        (task) =>
          new Date(task.dueDate).toDateString() ===
          selectedDate.toDateString()
      )
      .map((task) => (
        <div
          key={task._id}
          className="border rounded-lg p-3 mb-2"
        >
          {task.title}
        </div>
      ))}

        {/* Add Task */}

        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

              <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Update Task" : "Add New Task"}
              </h2>

              <form
              onSubmit={editingId ? handleUpdate : handleAddTask}
              className="space-y-4"
              >

            <input
              type="text"
              placeholder="Task Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              placeholder="Task Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Work">💼 Work</option>
            <option value="Study">📚 Study</option>
            <option value="Personal">🏠 Personal</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Health">🏋️ Health</option>
          </select>

          <div className="mb-5 mt-4">
          <label className="block font-semibold mb-2">
            Attachment
          </label>

          <input
            type="file"
            onChange={(e) =>
              setAttachment(e.target.files?.[0] || null)
            }
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

           <button
            type="submit"
            className={`w-full sm:w-auto text-white px-6 py-3 rounded-lg ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update Task" : "Add Task"}
          </button>

          </form>

        </div>

        {/* Task List */}

        <div>

          <input
              type="text"
              placeholder="Search Tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6"
            />

              <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-lg p-3 mb-6"
                  >
                    <option value="All">All Tasks</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

            <div className="mb-6">
            <label className="mr-3 font-semibold">
              Sort By:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="Latest">Latest</option>
              <option value="Due Date">Due Date</option>
              <option value="Priority">Priority</option>
            </select>
            </div>

           <div className="flex justify-end mb-5">
            <button
              onClick={exportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              📄 Export PDF
            </button>

              <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              📊 Export Excel
            </button>
          </div>

             <h2 className="text-2xl font-bold mb-6">
              My Tasks
            </h2>

          {filteredTasks.length === 0 ? (

            <div className="bg-white rounded-xl shadow-lg p-10 text-center text-gray-500">
              No Tasks Available
            </div>

          ) : (
          
        
          <div className="grid gap-5">

          {filteredTasks.map((task) => (
  
                <div
                  key={task._id}
                  className={`rounded-xl shadow-lg p-6 ${
                  isOverdue(task.dueDate, task.status)
                    ? "bg-red-100 border-2 border-red-500"
                    : isToday(task.dueDate)
                    ? "bg-yellow-100 border-2 border-yellow-500"
                    : "bg-white"
                }`}
                >

                  <div className="flex justify-between items-center">

                    <h3 className="text-xl font-bold">
                      {task.title}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {task.priority}
                    </span>

                  </div>

                  <p className="text-gray-600 mt-3">
                    {task.description}
                  </p>

                    <p>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </p>

                    <p className="mt-2 text-blue-600 font-semibold">
                      🏷️ {task.category}
                    </p>

                    {task.attachment && (
                      <p className="mt-2 text-blue-500">
                        📎 {task.attachment}
                      </p>
                    )}

                   <div className="mt-4 flex justify-between">

                    <span
                      className={`font-semibold ${
                        task.status === "Completed"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {task.status}
                    </span>

                  </div>

                  {/* Overdue / Due Today */}

                  {isOverdue(task.dueDate, task.status) && (
                    <p className="text-3xl sm:text-5xl font-bold mt-3">
                      ⚠️ Overdue
                    </p>
                  )}

                  {isToday(task.dueDate) && task.status !== "Completed" && (
                    <p className="text-yellow-700 font-bold mt-2">
                      📅 Due Today
                    </p>
                  )}

                  <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                {task.status !== "Completed" && (
                  <button
                    onClick={() => handleComplete(task)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Complete
                  </button>
                )}

                  <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setEditTitle("");
                    setEditDescription("");
                    setEditDueDate("");
                    setEditPriority("Medium");
                  }}
                  className="ml-3 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
                </div>
                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from "react"
import { LayoutGrid, List, Plus, ChevronDown, ChevronRight } from "lucide-react"
import CreateTaskModal from "./CreateTaskModal"
import TaskDetailsModal from "./TaskDetailsModal"

const formatDate = (dateString) => {
  if (!dateString || dateString === "-") return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

const formatTime = (timeString) => {
  if (!timeString) return "-"
  return timeString
}

const TaskView = ({ searchQuery, projectId }) => {
  const [activeView, setActiveView] = useState("table")
  const [tasks, setTasks] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        const allTasks = JSON.parse(savedTasks)
        setTasks(projectId ? allTasks.filter((task) => task.projectId === Number.parseInt(projectId)) : allTasks)
      }
    }

    loadTasks()
    const intervalId = setInterval(loadTasks, 5000)
    return () => clearInterval(intervalId)
  }, [projectId])

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.type.toLowerCase().includes(searchLower) ||
      task.description?.toLowerCase().includes(searchLower)
    )
  })

  const activeTasks = filteredTasks.filter((task) => task.status !== "Completed")
  const completedTasks = filteredTasks.filter((task) => task.status === "Completed")

  const handleCreateTask = (newTask) => {
    const taskWithId = {
      id: Date.now(),
      ...newTask,
      projectId: projectId ? Number.parseInt(projectId) : null,
    }
    const updatedTasks = [...tasks, taskWithId]
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const handleUpdateTask = (updatedTask) => {
    const now = new Date().toLocaleDateString()
    if (updatedTask.status === "Completed" && tasks.find((t) => t.id === updatedTask.id)?.status !== "Completed") {
      updatedTask.closedDate = now
    } else if (updatedTask.status !== "Completed") {
      updatedTask.closedDate = "-"
    }

    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const renderKanbanBoard = () => {
    const columns = [
      { id: "new", title: "New task", tasks: filteredTasks.filter((task) => task.status === "New task") },
      { id: "scheduled", title: "Scheduled", tasks: filteredTasks.filter((task) => task.status === "Scheduled") },
      { id: "progress", title: "In Progress", tasks: filteredTasks.filter((task) => task.status === "In Progress") },
      { id: "completed", title: "Completed", tasks: filteredTasks.filter((task) => task.status === "Completed") },
    ]

    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-4 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center mb-4">
                <h3 className="text-base font-medium text-gray-900">{column.title}</h3>
                <div className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {column.tasks.length}
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                {column.tasks.length > 0 ? (
                  <div className="space-y-3">
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={`${task.color} p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                      >
                        <div className="font-medium mb-1">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">{task.description}</div>
                        )}
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <div>Start: {formatTime(task.startTime)}</div>
                          <div>Due: {formatDate(task.dueDate)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {column.id === "completed" ? "No completed tasks yet" : "No tasks"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderTableView = () => (
    <div className="flex-1 overflow-auto">
      <div className="min-w-max">
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <div className="px-4 py-2 w-96">Task</div>
            <div className="px-4 py-2 w-32">Status</div>
            <div className="px-4 py-2 w-32">Type</div>
            <div className="px-4 py-2 w-32">Start time</div>
            <div className="px-4 py-2 w-32">Due date</div>
            <div className="px-4 py-2 w-40">Creation date</div>
            <div className="px-4 py-2 w-32">Closed date</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="flex items-center text-sm hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center px-4 py-2 w-96">
                <span className="mr-2">{task.icon}</span>
                <span className="truncate">{task.title}</span>
              </div>
              <div className="px-4 py-2 w-32">{task.status}</div>
              <div className="px-4 py-2 w-32">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${task.color}`}>
                  {task.type}
                </span>
              </div>
              <div className="px-4 py-2 w-32">{formatTime(task.startTime)}</div>
              <div className="px-4 py-2 w-32">{formatDate(task.dueDate)}</div>
              <div className="px-4 py-2 w-40">{task.creationDate}</div>
              <div className="px-4 py-2 w-32">{task.closedDate}</div>
            </div>
          ))}
        </div>

        {/* Completed Tasks Section */}
        <div className="mt-8">
          <div
            className="flex items-center px-4 py-2 bg-gray-100 cursor-pointer"
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          >
            {showCompletedTasks ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}
            <h3 className="font-medium">Completed Tasks ({completedTasks.length})</h3>
          </div>
          {showCompletedTasks && (
            <div className="divide-y divide-gray-200">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="flex items-center text-sm hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center px-4 py-2 w-96">
                    <span className="mr-2">{task.icon}</span>
                    <span className="truncate">{task.title}</span>
                  </div>
                  <div className="px-4 py-2 w-32">{task.status}</div>
                  <div className="px-4 py-2 w-32">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${task.color}`}>
                      {task.type}
                    </span>
                  </div>
                  <div className="px-4 py-2 w-32">{formatTime(task.startTime)}</div>
                  <div className="px-4 py-2 w-32">{formatDate(task.dueDate)}</div>
                  <div className="px-4 py-2 w-40">{task.creationDate}</div>
                  <div className="px-4 py-2 w-32">{task.closedDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </button>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 rounded flex items-center ${activeView === "table" ? "bg-white shadow" : ""}`}
              onClick={() => setActiveView("table")}
            >
              <List className="w-4 h-4 mr-2" />
              Table view
            </button>
            <button
              className={`px-3 py-1.5 rounded flex items-center ${activeView === "kanban" ? "bg-white shadow" : ""}`}
              onClick={() => setActiveView("kanban")}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban board
            </button>
          </div>
        </div>
      </div>

      {activeView === "kanban" ? renderKanbanBoard() : renderTableView()}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
        projectId={projectId}
      />

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default TaskView


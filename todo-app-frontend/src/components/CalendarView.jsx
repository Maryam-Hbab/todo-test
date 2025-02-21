import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import TaskDetailsModal from "./TaskDetailsModal"

const CalendarView = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    const allTasks = savedTasks ? JSON.parse(savedTasks) : []
    return projectId ? allTasks.filter((task) => task.projectId === Number.parseInt(projectId)) : allTasks
  })
  const [selectedTask, setSelectedTask] = useState(null)

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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (day) => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.dueDate === "-") return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getTaskPosition = (task) => {
    if (!task.startTime) return 0
    const [hours, minutes] = task.startTime.split(":").map(Number)
    return (hours * 60 + minutes) * (80 / 1440) // Convert minutes to pixels (80px per hour)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

    // Adjust first day to make Monday the first day of the week
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

    // Add week days header
    const weekDaysHeader = weekDays.map((day) => (
      <div key={day} className="py-2 text-sm font-medium text-gray-600 text-center border-b">
        {day}
      </div>
    ))

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border-b border-r p-2 bg-gray-50"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day)
      days.push(
        <div key={day} className="h-32 border-b border-r p-2 relative">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium">{day}</span>
            {dayTasks.length > 0 && (
              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-24">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`${task.color || "bg-yellow-100"} p-1 rounded text-xs cursor-pointer truncate hover:opacity-80`}
                style={{
                  marginTop: `${getTaskPosition(task)}px`,
                }}
              >
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{task.startTime}</span>
                  <span className="truncate">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 border-l border-t">
        {weekDaysHeader}
        {days}
      </div>
    )
  }

  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    setTasks(updatedTasks)
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        ...updatedTasks,
        ...(localStorage.getItem("tasks")
          ? JSON.parse(localStorage.getItem("tasks")).filter((task) => task.id !== updatedTask.id)
          : []),
      ]),
    )
  }

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    setSelectedTask(null)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">{renderCalendar()}</div>

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

export default CalendarView


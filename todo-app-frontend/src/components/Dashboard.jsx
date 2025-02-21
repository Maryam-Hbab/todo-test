import { useState, useEffect } from "react"
import { Bell, Search, Plus } from "lucide-react"
import { useLocation, useParams } from "react-router-dom"
import TextEditor from "./TextEditor"
import TaskView from "./TaskView"
import CalendarView from "./CalendarView"
import ProfileMenu from "./ProfileMenu"
import { checkUpcomingTasks, showNotification } from "../utils/notifications"
import Layout from "./Layout"

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [searchResults, setSearchResults] = useState({ tasks: [], notes: [] })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const location = useLocation()
  const { projectId } = useParams()

  // Check for upcoming tasks every minute
  useEffect(() => {
    const checkNotifications = () => {
      const upcomingTasks = checkUpcomingTasks()
      upcomingTasks.forEach((task) => {
        showNotification("Upcoming Task", `"${task.title}" is due in less than 2 days`)
      })
    }

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission()
    }

    checkNotifications() // Check immediately
    const interval = setInterval(checkNotifications, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setShowSearchResults(false)
      return
    }

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")

    const filteredTasks = projectId ? tasks.filter((task) => task.projectId === projectId) : tasks

    const filteredNotes = projectId ? notes.filter((note) => note.projectId === projectId) : notes

    const matchedTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description?.toLowerCase().includes(query.toLowerCase()),
    )

    const matchedNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults({ tasks: matchedTasks, notes: matchedNotes })
    setShowSearchResults(true)
  }

  const renderContent = () => {
    if (showSearchResults) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Tasks ({searchResults.tasks.length})</h3>
              {searchResults.tasks.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tasks found matching your search.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Notes ({searchResults.notes.length})</h3>
              {searchResults.notes.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.notes.map((note) => (
                    <div key={note.id} className={`p-4 rounded-lg ${note.color}`}>
                      <div className="font-medium">{note.title}</div>
                      <div className="text-sm text-gray-600">{note.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notes found matching your search.</p>
              )}
            </div>
          </div>
        </div>
      )
    }

    const path = location.pathname.split("/").pop()

    switch (path) {
      case "tasks":
        return <TaskView searchQuery={searchQuery} projectId={projectId} />
      case "calendar":
        return <CalendarView projectId={projectId} />
      case "notes":
        return <TextEditor searchQuery={searchQuery} projectId={projectId} />
      default:
        return <TaskView searchQuery={searchQuery} projectId={projectId} />
    }
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            {location.pathname.includes("/notes") && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add note
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks and notes"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                className="w-8 h-8 rounded-full bg-[#4A90E2] text-white flex items-center justify-center"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                m
              </button>

              <ProfileMenu isOpen={isProfileMenuOpen} onClose={() => setIsProfileMenuOpen(false)} />
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </Layout>
  )
}

export default Dashboard


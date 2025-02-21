import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  Plus,
  Menu,
  Star,
  Settings,
  Trash2,
  Copy,
  Pencil,
  Calendar,
  FileText,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const ProjectMenu = ({ project, onClose, onAddToFavorites, onRename, onDuplicate, onSettings, onDelete }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <button
        onClick={() => {
          onRename(project.id)
          onClose()
        }}
        className="w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-50"
      >
        <Pencil className="w-4 h-4" />
        <span>Rename project</span>
      </button>
      <button
        onClick={() => {
          onDuplicate(project.id)
          onClose()
        }}
        className="w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-50"
      >
        <Copy className="w-4 h-4" />
        <span>Duplicate project</span>
      </button>
      <div className="border-t border-gray-200 my-1" />
      <button
        onClick={() => {
          onDelete(project.id)
          onClose()
        }}
        className="w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete project</span>
      </button>
    </div>
  )
}

const Sidebar = ({ isCollapsed, onCollapse }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects")
    return savedProjects ? JSON.parse(savedProjects) : []
  })
  const [activeProject, setActiveProject] = useState(null)
  const [showProjectMenu, setShowProjectMenu] = useState(null)
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true)
  const [showNewProjectInput, setShowNewProjectInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(true)

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  const handleProjectClick = (projectId) => {
    setActiveProject(projectId)
    navigate(`/project/${projectId}/tasks`)
  }

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName.trim(),
        tasks: [],
        notes: [],
        isFavorite: false,
      }
      setProjects([...projects, newProject])
      setNewProjectName("")
      setShowNewProjectInput(false)
    }
  }

  const toggleWorkspaceVisibility = () => {
    setIsWorkspaceVisible((prev) => !prev)
  }

  return (
    <div className="flex h-full">
      {/* Dark Sidebar */}
      <div
        className={`bg-[#0A1F62] text-gray-400 transition-all duration-200 flex flex-col ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="p-4 flex-grow">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center">m</div>
                <button
                  className="font-medium flex items-center"
                  onClick={toggleWorkspaceVisibility}
                  title={isWorkspaceVisible ? "Hide Workspace" : "Show Workspace"}
                >
                  {isWorkspaceVisible ? (
                    <>
                      My Workspace
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      My Workspace
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            )}
            {!isCollapsed && (
              <button onClick={onCollapse} className="p-1 hover:bg-white/10 rounded">
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
          {isWorkspaceVisible && !isCollapsed && (
            <div className="mt-6 space-y-4">
              <div className="px-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              <button
                onClick={() => {
                  setActiveProject(null)
                  navigate("/tasks")
                }}
                className={`flex items-center space-x-2 w-full px-2 py-2 rounded-lg ${
                  !activeProject && location.pathname === "/tasks" ? "bg-white/10" : "hover:bg-white/10"
                }`}
              >
                <div className="w-6 h-6 bg-[#4A90E2] rounded-full flex items-center justify-center text-sm">m</div>
                <span>All my activities</span>
              </button>

              <div>
                <div className="flex items-center justify-between px-2 py-2 text-gray-400">
                  <button
                    onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                    className="flex items-center hover:text-white"
                  >
                    <ChevronDown
                      className={`w-4 h-4 mr-2 transform transition-transform ${isProjectsExpanded ? "" : "-rotate-90"}`}
                    />
                    <span>Projects</span>
                  </button>
                  <button onClick={() => setShowNewProjectInput(true)} className="hover:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {isProjectsExpanded && (
                  <div className="mt-2 space-y-1">
                    {showNewProjectInput && (
                      <div className="px-2 mb-2">
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddProject()
                            if (e.key === "Escape") setShowNewProjectInput(false)
                          }}
                          placeholder="Project name"
                          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                          autoFocus
                        />
                      </div>
                    )}

                    {projects.map((project) => (
                      <div key={project.id} className="relative group">
                        <button
                          onClick={() => handleProjectClick(project.id)}
                          className={`flex items-center justify-between w-full px-2 py-2 rounded-lg ${
                            activeProject === project.id ? "bg-white/10" : "hover:bg-white/10"
                          }`}
                        >
                          <span>{project.name}</span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowProjectMenu(showProjectMenu === project.id ? null : project.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                        {showProjectMenu === project.id && (
                          <ProjectMenu
                            project={project}
                            onClose={() => setShowProjectMenu(null)}
                            onAddToFavorites={(id) => {
                              setProjects(projects.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)))
                            }}
                            onRename={(id) => {
                              const newName = prompt("Enter new project name:")
                              if (newName?.trim()) {
                                setProjects(projects.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p)))
                              }
                            }}
                            onDuplicate={(id) => {
                              const projectToDuplicate = projects.find((p) => p.id === id)
                              if (projectToDuplicate) {
                                const duplicatedProject = {
                                  ...projectToDuplicate,
                                  id: Date.now(),
                                  name: `${projectToDuplicate.name} (copy)`,
                                  isFavorite: false,
                                }
                                setProjects([...projects, duplicatedProject])
                              }
                            }}
                            onSettings={(id) => {
                              navigate(`/project/${id}/settings`)
                              setShowProjectMenu(null)
                            }}
                            onDelete={(id) => {
                              if (window.confirm("Are you sure you want to delete this project?")) {
                                setProjects(projects.filter((p) => p.id !== id))
                                if (activeProject === id) {
                                  setActiveProject(null)
                                  navigate("/tasks")
                                }
                              }
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Always show the toggle button at the bottom when workspace is hidden */}
        {!isWorkspaceVisible && (
          <button
            onClick={toggleWorkspaceVisibility}
            className="p-4 w-full flex justify-center hover:bg-white/10"
            title="Show Workspace"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tools Panel - Always visible */}
      <div className={`w-64 bg-white border-r transition-all duration-200`}>
        <div className="p-4">
          <div className="flex items-center mb-4">
            <span className="text-gray-600 font-medium">Tools</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => navigate(activeProject ? `/project/${activeProject}/tasks` : "/tasks")}
              className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${
                location.pathname.includes("/tasks") ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <CheckSquare className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Tasks</span>
            </button>
            <button
              onClick={() => navigate(activeProject ? `/project/${activeProject}/calendar` : "/calendar")}
              className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${
                location.pathname.includes("/calendar") ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Calendar</span>
            </button>
            <button
              onClick={() => navigate(activeProject ? `/project/${activeProject}/notes` : "/notes")}
              className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg ${
                location.pathname.includes("/notes") ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Notes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar


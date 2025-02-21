import { useState, useEffect } from "react"
import { X, Calendar, Clock, Paperclip, Tag, Plus, Repeat, ChevronDown, Check } from "lucide-react"
import { getStoredTypes } from "../utils/taskTypes"

const taskStatuses = ["New task", "Scheduled", "In Progress", "Completed"]

const colorOptions = [
  { name: "Red", class: "bg-red-100" },
  { name: "Pink", class: "bg-pink-100" },
  { name: "Purple", class: "bg-purple-100" },
  { name: "Deep Purple", class: "bg-indigo-100" },
  { name: "Blue", class: "bg-blue-100" },
  { name: "Light Blue", class: "bg-sky-100" },
  { name: "Cyan", class: "bg-cyan-100" },
  { name: "Teal", class: "bg-teal-100" },
  { name: "Green", class: "bg-green-100" },
  { name: "Light Green", class: "bg-lime-100" },
  { name: "Yellow", class: "bg-yellow-100" },
  { name: "Amber", class: "bg-amber-100" },
  { name: "Orange", class: "bg-orange-100" },
  { name: "Deep Orange", class: "bg-red-200" },
  { name: "Brown", class: "bg-amber-200" },
  { name: "Grey", class: "bg-gray-200" },
]

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(null)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [types, setTypes] = useState(getStoredTypes())

  useEffect(() => {
    if (task) {
      setEditedTask(task)
    }
  }, [task])

  useEffect(() => {
    setTypes(getStoredTypes())
  }, [])

  if (!isOpen || !task || !editedTask) return null

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  const handleStatusSelect = (status) => {
    setEditedTask({ ...editedTask, status })
    setIsStatusDropdownOpen(false)
  }

  const handleColorSelect = (color) => {
    setEditedTask({ ...editedTask, color })
    setIsColorPickerOpen(false)
  }

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-medium">
                {editedTask.icon}{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  editedTask.title
                )}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:text-gray-800">
                  Edit
                </button>
              )}
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="relative">
                  <h3 className="text-sm text-gray-500 mb-2">Status</h3>
                  {isEditing ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                      >
                        <span>{editedTask.status}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {isStatusDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {taskStatuses.map((status) => (
                            <button
                              key={status}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50"
                              onClick={() => handleStatusSelect(status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">{editedTask.status}</div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Type</h3>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={editedTask.type}
                        onChange={(e) => setEditedTask({ ...editedTask, type: e.target.value })}
                        className="flex-1 border rounded px-2 py-1"
                      >
                        {types
                          .filter((type) => type.tasks)
                          .map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                      </select>
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded ${editedTask.color} cursor-pointer`}
                          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                        />
                        {isColorPickerOpen && (
                          <div className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 grid grid-cols-4 gap-2">
                            {colorOptions.map((color) => (
                              <div
                                key={color.name}
                                className={`w-6 h-6 rounded ${color.class} cursor-pointer flex items-center justify-center`}
                                onClick={() => handleColorSelect(color.class)}
                              >
                                {color.class === editedTask.color && <Check className="w-4 h-4 text-gray-600" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${editedTask.color}`}>
                      {editedTask.type}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Due date</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedTask.dueDate.split("T")[0]}
                        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded-lg"
                      />
                    ) : (
                      <span>{formatDate(editedTask.dueDate)}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Start time</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedTask.startTime || ""}
                        onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-200 rounded-lg"
                      />
                    ) : (
                      <span>{editedTask.startTime || "No start time set"}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Assignee</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white">
                      m
                    </div>
                    <span>Me</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                  {isEditing ? (
                    <textarea
                      value={editedTask.description || ""}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      className="w-full border rounded p-2 h-32"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{editedTask.description || "No description"}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Time blocks</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-4">
                      <div>
                        <span className="text-blue-500">●</span> Spent time: 0h
                      </div>
                      <div>
                        <span className="text-gray-400">●</span> Estimated time: {editedTask.estimatedTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>{editedTask.creationDate}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-500">Planned {editedTask.estimatedTime}</span>
                        <span className="text-gray-500">Spent 0h</span>
                        <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white">
                          m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="flex items-center justify-between p-4 border-t">
              <button onClick={handleDelete} className="px-4 py-2 text-red-600 hover:text-red-700">
                Delete task
              </button>
              <div className="flex space-x-3">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsModal


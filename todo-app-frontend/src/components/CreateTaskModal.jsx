import { useState, useEffect } from "react"
import { X, Repeat, Paperclip, Tag, Plus, Calendar, Clock, ChevronDown, Settings2 } from "lucide-react"
import EditTypesModal from "./EditTypesModal"
import { getStoredTypes, saveTypes } from "../utils/taskTypes"

const taskStatuses = ["New task", "Scheduled", "In Progress", "Completed"]

const CreateTaskModal = ({ isOpen, onClose, onCreateTask, projectId }) => {
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [selectedType, setSelectedType] = useState(getStoredTypes()[0])
  const [selectedStatus, setSelectedStatus] = useState(taskStatuses[0])
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isEditTypesModalOpen, setIsEditTypesModalOpen] = useState(false)
  const [types, setTypes] = useState(getStoredTypes())
  const [dueDate, setDueDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [estimatedTime, setEstimatedTime] = useState("")

  useEffect(() => {
    setTypes(getStoredTypes())
  }, [])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const now = new Date().toISOString()

    const newTask = {
      title: taskName,
      description: taskDescription,
      status: selectedStatus,
      type: selectedType.name,
      color: selectedType.color,
      creationDate: now,
      closedDate: selectedStatus === "Completed" ? now : "-",
      dueDate: dueDate ? new Date(dueDate).toISOString() : "-",
      startTime: startTime ? new Date(`${dueDate}T${startTime}`).toISOString() : "-",
      estimatedTime: estimatedTime || "0h",
      icon: "📝",
      projectId: projectId ? Number.parseInt(projectId) : null,
    }

    onCreateTask(newTask)

    setTaskName("")
    setTaskDescription("")
    setDueDate("")
    setStartTime("09:00")
    setEstimatedTime("")
    setSelectedStatus(taskStatuses[0])
    onClose()
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setIsTypeDropdownOpen(false)
  }

  const handleStatusSelect = (status) => {
    setSelectedStatus(status)
    setIsStatusDropdownOpen(false)
  }

  const handleTypesUpdate = (updatedTypes) => {
    setTypes(updatedTypes)
    if (!updatedTypes.find((t) => t.id === selectedType.id)?.tasks) {
      setSelectedType(updatedTypes.find((t) => t.tasks) || updatedTypes[0])
    }
    saveTypes(updatedTypes)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex h-full">
          {/* Main Form Section */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create task</h2>
              <div className="flex items-center space-x-4">
                <button onClick={onClose}>
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Task name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />

              <textarea
                placeholder="Task description"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Create task
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-l">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Create in</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white">m</div>
                  <span className="font-medium">My Workspace</span>
                </div>
              </div>

              <div className="relative">
                <h3 className="text-sm text-gray-500 mb-2">Type</h3>
                <button
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded ${selectedType.color} mr-2`} />
                    <span>{selectedType.name}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isTypeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {types
                      .filter((type) => type.tasks)
                      .map((type) => (
                        <button
                          key={type.id}
                          className="w-full flex items-center px-3 py-2 hover:bg-gray-50"
                          onClick={() => handleTypeSelect(type)}
                        >
                          <div className={`w-4 h-4 rounded ${type.color} mr-2`} />
                          <span>{type.name}</span>
                        </button>
                      ))}
                    <button
                      className="w-full flex items-center px-3 py-2 hover:bg-gray-50 border-t"
                      onClick={() => {
                        setIsTypeDropdownOpen(false)
                        setIsEditTypesModalOpen(true)
                      }}
                    >
                      <Settings2 className="w-4 h-4 mr-2" />
                      Edit types
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <h3 className="text-sm text-gray-500 mb-2">Status</h3>
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                >
                  <span>{selectedStatus}</span>
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

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Assignee</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white">m</div>
                  <span>Me</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Due date</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Start time</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Estimated time</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g. 2h 30m"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditTypesModal
        isOpen={isEditTypesModalOpen}
        onClose={() => setIsEditTypesModalOpen(false)}
        onSave={handleTypesUpdate}
      />
    </div>
  )
}

export default CreateTaskModal


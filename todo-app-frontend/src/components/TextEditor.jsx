import { useState, useEffect } from "react"
import { Bold, Italic, Underline, AlignLeft, LinkIcon, List, ListOrdered, Plus } from "lucide-react"

const colorOptions = [
  { name: "Yellow", class: "bg-yellow-100" },
  { name: "Blue", class: "bg-blue-100" },
  { name: "Pink", class: "bg-pink-100" },
  { name: "Orange", class: "bg-orange-100" },
  { name: "Green", class: "bg-green-100" },
  { name: "Purple", class: "bg-purple-100" },
]

const TextEditor = ({ searchQuery, projectId }) => {
  const [notes, setNotes] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: colorOptions[0].class,
  })

  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem("notes")
      if (savedNotes) {
        const allNotes = JSON.parse(savedNotes)
        const filteredNotes = projectId
          ? allNotes.filter((note) => note.projectId === Number.parseInt(projectId))
          : allNotes
        setNotes(filteredNotes)
      }
    }

    loadNotes()
    // Reload notes every 5 seconds to catch any external changes
    const intervalId = setInterval(loadNotes, 5000)
    return () => clearInterval(intervalId)
  }, [projectId])

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const noteWithId = {
        id: Date.now(),
        ...newNote,
        projectId: projectId ? Number.parseInt(projectId) : null,
      }

      // Update local state
      setNotes((prevNotes) => [...prevNotes, noteWithId])

      // Update localStorage
      const savedNotes = localStorage.getItem("notes")
      const allNotes = savedNotes ? JSON.parse(savedNotes) : []
      const updatedAllNotes = [...allNotes, noteWithId]
      localStorage.setItem("notes", JSON.stringify(updatedAllNotes))

      setNewNote({
        title: "",
        content: "",
        color: colorOptions[0].class,
      })
      setIsCreating(false)
    }
  }

  const handleDeleteNote = (id) => {
    // Update local state
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))

    // Update localStorage
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      const allNotes = JSON.parse(savedNotes)
      const updatedAllNotes = allNotes.filter((note) => note.id !== id)
      localStorage.setItem("notes", JSON.stringify(updatedAllNotes))
    }
  }

  const formatButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
    { icon: AlignLeft, label: "Align" },
    { icon: LinkIcon, label: "Link" },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Plus, label: "More" },
  ]

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {notes.map((note) => (
            <div key={note.id} className={`${note.color} rounded-lg p-4 shadow-sm break-words relative group`}>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-gray-700 transition-opacity"
              >
                ×
              </button>
              <h3 className="font-medium mb-2">{note.title}</h3>
              <div className="whitespace-pre-line text-sm text-gray-600">{note.content}</div>
            </div>
          ))}

          {/* Add Note Card */}
          <div className={`bg-gray-200 rounded-lg p-4 shadow-sm min-h-[200px] ${isCreating ? "hidden" : ""}`}>
            <button
              onClick={() => setIsCreating(true)}
              className="w-full h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* New Note Form */}
          {isCreating && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full mb-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full h-32 mb-4 px-2 py-1 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      className={`w-6 h-6 rounded-full ${color.class} ${
                        newNote.color === color.class ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setNewNote({ ...newNote, color: color.class })}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextEditor


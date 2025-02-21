import { useEffect, useRef } from "react"
import { Settings, Package, Map, HelpCircle, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ProfileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white">m</div>
          <div>
            <div className="font-medium">maryam hbab</div>
            <div className="text-sm text-gray-500">maryamhbab2335@gmail.com</div>
          </div>
        </div>
      </div>

      <nav className="py-2">
        <button
          onClick={() => {
            navigate("/profile/settings")
            onClose()
          }}
          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Profile settings</span>
        </button>
        <div className="border-t border-gray-100 my-2" />
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 text-left text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </nav>
    </div>
  )
}

export default ProfileMenu


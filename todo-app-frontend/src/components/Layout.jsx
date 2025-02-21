import { useState } from "react"
import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isCollapsed={isSidebarCollapsed} onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  )
}

export default Layout


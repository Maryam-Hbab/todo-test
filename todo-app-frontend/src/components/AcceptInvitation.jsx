"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../utils/axios-config"

const AcceptInvitation = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await axios.post(`/api/projects/${projectId}/accept-invitation`)
        if (response.data.success) {
          setStatus("success")
          // Redirect to the project page after a short delay
          setTimeout(() => navigate(`/project/${projectId}/tasks`), 3000)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Error accepting invitation:", error)
        setStatus("error")
      }
    }

    acceptInvitation()
  }, [projectId, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        {status === "loading" && <p className="text-xl">Accepting invitation...</p>}
        {status === "success" && (
          <div>
            <p className="text-xl text-green-600 mb-4">Invitation accepted successfully!</p>
            <p>You will be redirected to the project page shortly.</p>
          </div>
        )}
        {status === "error" && (
          <p className="text-xl text-red-600">There was an error accepting the invitation. Please try again.</p>
        )}
      </div>
    </div>
  )
}

export default AcceptInvitation


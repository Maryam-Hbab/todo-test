import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Search } from "lucide-react"
import Layout from "./Layout"

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
      active
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
)

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("my-profile")
  const [formData, setFormData] = useState({
    firstName: "maryam",
    lastName: "hbab",
    email: "maryamhbab2335@gmail.com",
    country: "",
    location: "",
    phone: "",
    birthday: {
      day: "",
      month: "",
    },
    language: "English",
    timezone: "(GMT+01:00) Casablanca",
    dateFormat: "31 December 2022",
    timeFormat: "24 hours: 21:00",
    weekFormat: "Sunday",
    showAllTasks: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const renderMyProfile = () => (
    <div className="max-w-3xl">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-24 h-24 bg-[#4A90E2] rounded-full flex items-center justify-center text-white text-3xl">
          m
        </div>
        <div>
          <h2 className="text-xl font-medium">maryam hbab</h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">{formData.email}</span>
            <button className="text-blue-500 hover:text-blue-600">change email</button>
          </div>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">First name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a country</option>
            <option value="MA">Morocco</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="FR">France</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter your location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Phone number</label>
          <div className="flex">
            <select className="w-24 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>+000</option>
              <option>+212</option>
              <option>+1</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="000 000 00 00"
              value={formData.phone}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Birthday</label>
          <div className="flex space-x-4">
            <input
              type="text"
              name="birthday.day"
              placeholder="Day"
              value={formData.birthday.day}
              onChange={handleInputChange}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="birthday.month"
              value={formData.birthday.month}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-blue-600">
          Save changes
        </button>
      </form>
    </div>
  )

  const renderPreferences = () => (
    <div className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm text-gray-500 mb-1">Language</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Time zone</label>
        <select
          name="timezone"
          value={formData.timezone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>(GMT+01:00) Casablanca</option>
          <option>(GMT+00:00) London</option>
          <option>(GMT-05:00) New York</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Date format</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="dateFormat"
              value="31 December 2022"
              checked={formData.dateFormat === "31 December 2022"}
              onChange={handleInputChange}
              className="mr-2"
            />
            31 December 2022
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="dateFormat"
              value="December 31, 2022"
              checked={formData.dateFormat === "December 31, 2022"}
              onChange={handleInputChange}
              className="mr-2"
            />
            December 31, 2022
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Time format</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="timeFormat"
              value="12 hours: 9:00 PM"
              checked={formData.timeFormat === "12 hours: 9:00 PM"}
              onChange={handleInputChange}
              className="mr-2"
            />
            12 hours: 9:00 PM
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="timeFormat"
              value="24 hours: 21:00"
              checked={formData.timeFormat === "24 hours: 21:00"}
              onChange={handleInputChange}
              className="mr-2"
            />
            24 hours: 21:00
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Week format</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="weekFormat"
              value="Monday"
              checked={formData.weekFormat === "Monday"}
              onChange={handleInputChange}
              className="mr-2"
            />
            Monday
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="weekFormat"
              value="Sunday"
              checked={formData.weekFormat === "Sunday"}
              onChange={handleInputChange}
              className="mr-2"
            />
            Sunday
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="showAllTasks"
            checked={formData.showAllTasks}
            onChange={handleInputChange}
            className="mr-2"
          />
          Show all tasks assigned to me within the Organizations in My Workspace
        </label>
      </div>

      <button type="submit" className="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-blue-600">
        Save changes
      </button>
    </div>
  )

  const renderIntegrations = () => (
    <div className="max-w-3xl">
      <p className="text-gray-500 italic mb-4">No integrations yet</p>
      <button className="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-blue-600">Add integration</button>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
        <p className="text-gray-500 italic">No accounts yet</p>
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm text-gray-500 mb-1">Current password</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">New password</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Confirm new password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button type="submit" className="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-blue-600">
        Change password
      </button>

      <div className="mt-12 pt-12 border-t">
        <h3 className="text-lg font-medium mb-4">Delete Account</h3>
        <p className="text-gray-500 mb-4">
          After deleting your account you will lose all related information including tasks, events, projects, notes
          etc. You will not be able to recover it later, so think twice before doing this.
        </p>
        <button className="text-red-600 hover:text-red-700">Delete account</button>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold">Profile settings</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#4A90E2] text-white flex items-center justify-center">
                  m
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <TabButton active={activeTab === "my-profile"} onClick={() => setActiveTab("my-profile")}>
                My profile
              </TabButton>
              <TabButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")}>
                Preferences
              </TabButton>
              <TabButton active={activeTab === "integrations"} onClick={() => setActiveTab("integrations")}>
                Integrations
              </TabButton>
              <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")}>
                Security
              </TabButton>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "my-profile" && renderMyProfile()}
          {activeTab === "preferences" && renderPreferences()}
          {activeTab === "integrations" && renderIntegrations()}
          {activeTab === "security" && renderSecurity()}
        </div>
      </div>
    </Layout>
  )
}

export default ProfileSettings


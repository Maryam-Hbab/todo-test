export const checkUpcomingTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const now = new Date()
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
  
    return tasks.filter((task) => {
      if (!task.dueDate || task.dueDate === "-") return false
      const dueDate = new Date(task.dueDate)
      return dueDate > now && dueDate <= twoDaysFromNow && task.status !== "Completed"
    })
  }
  
  export const showNotification = (title, body) => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification")
      return
    }
  
    if (Notification.permission === "granted") {
      new Notification(title, { body })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body })
        }
      })
    }
  }
  
  
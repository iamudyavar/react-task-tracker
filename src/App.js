import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
const axios = require('axios')
const qs = require('qs')

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  // Get tasks from database on page load
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch All Tasks
  const fetchTasks = async () => {
    const res = await axios.get('api/tasks')
    const data = await res.data

    return data
  }

  // Fetch a Specific Task
  const fetchTask = async (id) => {
    const data = await fetchTasks()

    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === id) {
        return data[i]
      }
    }

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await axios.post('api/tasks', qs.stringify(task))
    const data = await res.data

    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await axios.delete(`api/tasks/${id}`)

    setTasks(tasks.filter((task) => task._id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }

    const res = await axios.put(`api/tasks/${id}`, qs.stringify(updTask))
    const data = await res.data

    setTasks(tasks.map((task) => task._id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <Router>
      <div className='container'>
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        {showAddTask && <AddTask onAdd={addTask} />}

        <Routes>
          <Route path='/' element={
            <>
              {tasks.length > 0
                ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
                : <p style={{ color: 'white', textAlign: 'center' }}>No Tasks to Show</p>
              }
            </>
          } />
          <Route path='/about' element={<About />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
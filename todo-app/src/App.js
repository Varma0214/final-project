import React, {useState, useEffect} from 'react'

import './App.css'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt, faEdit, faCheck} from '@fortawesome/free-solid-svg-icons'

function Task({task, onDelete, onEdit, onToggle}) {
  const [editMode, setEditMode] = useState(false)
  const [editedText, setEditedText] = useState(task.text)

  const handleEdit = () => {
    onEdit(task.id, editedText)
    setEditMode(false)
  }

  return (
    <li className={task.completed ? 'completed' : ''}>
      {!editMode ? (
        <>
          <span>{task.text}</span>
          <div className='task-buttons'>
            <button onClick={() => onToggle(task.id)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={() => setEditMode(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDelete(task.id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type='text'
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
        </>
      )}
    </li>
  )
}

function App() {
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState('')

  useEffect(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
    setTasks(savedTasks)
  }, [])

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTaskText.trim() === '') return
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    }
    setTasks([...tasks, newTask])
    setNewTaskText('')
  }

  const deleteTask = taskId => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
  }

  const editTask = (taskId, newText) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? {...task, text: newText} : task,
    )
    setTasks(updatedTasks)
  }

  const toggleTaskCompletion = taskId => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? {...task, completed: !task.completed} : task,
    )
    setTasks(updatedTasks)
  }

  return (
    <div className='App'>
      <h1>Todo App</h1>
      <input
        type='text'
        value={newTaskText}
        onChange={e => setNewTaskText(e.target.value)}
        placeholder='Enter new task'
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onEdit={editTask}
            onToggle={toggleTaskCompletion}
          />
        ))}
      </ul>
    </div>
  )
}

export default App

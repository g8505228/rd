import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList(props) {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'completed'

  // Function to get tasks from the server
  function fetchTasks() {
    // Make API call to get tasks
    axios.get('http://localhost:8000/api/tasks/')
      .then(function(response) {
        setTasks(response.data);
        setErrorMessage('');
      })
      .catch(function(error) {
        console.error('Error fetching tasks:', error);
        setErrorMessage('Failed to load tasks. Please try again later.');
      });
  }

  // Function to delete a task
  function deleteTask(id) {
    axios.delete('http://localhost:8000/api/tasks/' + id + '/')
      .then(function(response) {
        // Refresh the task list
        fetchTasks();
      })
      .catch(function(error) {
        console.error('Error deleting task:', error);
        setErrorMessage('Failed to delete task. Please try again.');
      });
  }

  // Function to mark a task as complete or incomplete
  function toggleTaskCompletion(task) {
    // Update the task's completed status to the opposite of what it currently is
    const updatedData = {
      completed: !task.completed
    };
    
    axios.patch('http://localhost:8000/api/tasks/' + task.id + '/', updatedData)
      .then(function(response) {
        // Refresh the task list
        fetchTasks();
      })
      .catch(function(error) {
        console.error('Error updating task:', error);
        setErrorMessage('Failed to update task status. Please try again.');
      });
  }

  // Get tasks when component loads or when refreshTrigger changes
  useEffect(function() {
    fetchTasks();
  }, [props.refreshTrigger]);

  // Filter tasks based on which filter button is active
  let tasksToShow = [];
  
  if (activeFilter === 'all') {
    tasksToShow = tasks;
  } else if (activeFilter === 'active') {
    tasksToShow = tasks.filter(function(task) {
      return task.completed === false;
    });
  } else if (activeFilter === 'completed') {
    tasksToShow = tasks.filter(function(task) {
      return task.completed === true;
    });
  }

  // Function to handle filter button clicks
  function handleFilterClick(filterName) {
    setActiveFilter(filterName);
  }

  // Function to format the date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  // Function to handle edit button click
  function handleEditClick(task) {
    props.onEditTask(task);
  }

  // Function to handle delete button click
  function handleDeleteClick(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  }

  return (
    <div className="task-list">
      {/* Show error message if there is one */}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeFilter === 'all' ? 'active text-primary' : 'text-secondary'}`}
                onClick={function() { handleFilterClick('all'); }}
              >
                All
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeFilter === 'active' ? 'active text-primary' : 'text-secondary'}`}
                onClick={function() { handleFilterClick('active'); }}
              >
                Active
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeFilter === 'completed' ? 'active text-primary' : 'text-secondary'}`}
                onClick={function() { handleFilterClick('completed'); }}
              >
                Completed
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          {tasksToShow.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No tasks found</p>
              {activeFilter !== 'all' && (
                <button 
                  className="btn btn-link p-0 mt-2"
                  onClick={function() { handleFilterClick('all'); }}
                >
                  View all tasks
                </button>
              )}
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {tasksToShow.map(function(task) {
                return (
                  <li key={task.id} className="list-group-item p-3">
                    <div className="d-flex align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={"task-" + task.id}
                          checked={task.completed}
                          onChange={function() { toggleTaskCompletion(task); }}
                        />
                         <label 
                          className={`form-check-label ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                          htmlFor={"task-" + task.id}
                        >
                          {task.title}
                        </label>
                      </div>
                      <small className="text-muted ms-auto me-3">
                        {formatDate(task.created_at)}
                      </small>
                      <div className="task-actions">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={function() { handleEditClick(task); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={function() { handleDeleteClick(task.id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {/* Show description if it exists */}
                    {task.description && (
                      <div className="task-description mt-2 ms-4 ps-2 border-start">
                        <small className={task.completed ? 'text-muted' : ''}>
                          {task.description}
                        </small>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
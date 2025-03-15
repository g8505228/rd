import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Header from './components/Header';
import './App.css';

function App() {
  // Store the current task being edited
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState(null);
  // Used to tell TaskList to refresh
  const [shouldRefreshList, setShouldRefreshList] = useState(false);
  // Controls whether form is visible or not
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function that runs when a task is added or edited
  function handleTaskSaved() {
    // Toggle the refresh trigger to make TaskList reload data
    if (shouldRefreshList === true) {
      setShouldRefreshList(false);
    } else {
      setShouldRefreshList(true);
    }
    // Hide the form
    setIsFormVisible(false);
  }

  // Function to handle showing form for adding new task
  function showAddTaskForm() {
    setCurrentTaskToEdit(null);
    setIsFormVisible(!isFormVisible);
  }

  // Function to handle showing form for editing task
  function showEditTaskForm(task) {
    setCurrentTaskToEdit(task);
    setIsFormVisible(true);
  }

  return (
    <div className="app-container">
      {/* App header with title */}
      <Header />
      
      <div className="container py-4">
        {/* Title and Add Task button */}
        <div className="row mb-4">
          <div className="col d-flex justify-content-between align-items-center">
            <h2 className="mb-0">My Tasks</h2>
            <button 
              className="btn btn-primary" 
              onClick={showAddTaskForm}
            >
              {isFormVisible ? 'Hide Form' : '+ Add New Task'}
            </button>
          </div>
        </div>
        
        {/* Task form section - only shows when isFormVisible is true */}
        {isFormVisible === true && (
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto">
              <TaskForm 
                taskToEdit={currentTaskToEdit} 
                setTaskToEdit={setCurrentTaskToEdit} 
                onTaskAdded={handleTaskSaved} 
              />
            </div>
          </div>
        )}
        
        {/* Task list section */}
        <div className="row">
          <div className="col-12">
            <TaskList 
              onEditTask={showEditTaskForm} 
              refreshTrigger={shouldRefreshList} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
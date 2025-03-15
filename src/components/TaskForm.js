import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm(props) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // When the task to edit changes, update the form
  useEffect(function() {
    if (props.taskToEdit) {
      // If we're editing a task, fill the form with task data
      setTitle(props.taskToEdit.title);
      if (props.taskToEdit.description) {
        setDescription(props.taskToEdit.description);
      } else {
        setDescription('');
      }
    } else {
      // If we're adding a new task, clear the form
      setTitle('');
      setDescription('');
    }
    setErrorMessage('');
  }, [props.taskToEdit]);

  // Form submit handler
  function handleSubmit(event) {
    // Prevent form from reloading the page
    event.preventDefault();
    
    // Validate the form
    if (!title || title.trim() === '') {
      setErrorMessage('Title is required');
      return;
    }
    
    // Prepare the data to send to the server
    const taskData = {
      title: title,
      description: description,
    };

    // Clear any previous errors
    setErrorMessage('');
    
    // Determine if we're creating or updating a task
    if (props.taskToEdit) {
      // Update existing task
      axios.put('http://localhost:8000/api/tasks/' + props.taskToEdit.id + '/', taskData)
        .then(function(response) {
          // Clear form
          setTitle('');
          setDescription('');
          props.setTaskToEdit(null);
          
          // Tell parent component a task was added/updated
          props.onTaskAdded();
        })
        .catch(function(error) {
          console.error('Error saving task:', error);
          setErrorMessage('Failed to save task. Please try again.');
        });
    } else {
      // Create new task
      axios.post('http://localhost:8000/api/tasks/', taskData)
        .then(function(response) {
          // Clear form
          setTitle('');
          setDescription('');
          
          // Tell parent component a task was added/updated
          props.onTaskAdded();
        })
        .catch(function(error) {
          console.error('Error saving task:', error);
          setErrorMessage('Failed to save task. Please try again.');
        });
    }
  }

  // Handler for title input changes
  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  // Handler for description input changes
  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  // Handler for cancel button
  function handleCancel() {
    props.setTaskToEdit(null);
    setTitle('');
    setDescription('');
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-3">
          {props.taskToEdit ? 'Edit Task' : 'Add New Task'}
        </h3>
        
        {/* Show error message if there is one */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description (optional)</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              rows="3"
              placeholder="Add details about this task..."
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            {/* Only show Cancel button when editing a task */}
            {props.taskToEdit && (
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {props.taskToEdit ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
// src/components/AdminCourseManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', description: '', duration: '', videoUrl: '', visible: true });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.get('/api/courses');
    setCourses(response.data);
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    await axios.post('/api/courses', newCourse);
    fetchCourses();
  };

  const handleDeleteCourse = async (id) => {
    await axios.delete(`/api/courses/${id}`);
    fetchCourses();
  };

  const handleToggleVisibility = async (id) => {
    const course = courses.find(c => c.id === id);
    await axios.put(`/api/courses/${id}`, { ...course, visible: !course.visible });
    fetchCourses();
  };

  return (
    <div>
      <h1>Manage Courses</h1>
      <form onSubmit={handleAddCourse}>
        <input type="text" name="name" placeholder="Course Name" onChange={handleInputChange} />
        <input type="text" name="description" placeholder="Description" onChange={handleInputChange} />
        <input type="text" name="duration" placeholder="Duration" onChange={handleInputChange} />
        <input type="text" name="videoUrl" placeholder="Video URL" onChange={handleInputChange} />
        <button type="submit">Add Course</button>
      </form>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <p>{course.duration}</p>
            <button onClick={() => handleToggleVisibility(course.id)}>
              {course.visible ? 'Hide' : 'Show'}
            </button>
            <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCourseManagement;

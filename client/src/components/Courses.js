// src/components/UserCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const response = await axios.get('http://localhost:3000/api/courses');
    setCourses(response.data.filter(course => course.visible));
  };

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>
              <h2>{course.name}</h2>
            </Link>
            <p>{course.description}</p>
            <p>{course.duration}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCourses;

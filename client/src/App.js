import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/DashBoard';
import TrackingHistory from './components/TrackingHistory';
import TrackingFood from './components/TrackingFood';
import TaskList from './components/TaskList';
import Sidebar from './components/Navbar';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute'; // Correct path for AdminRoute
import { AuthProvider, AuthContext } from './context/AuthContext'; // Correct path for AuthContext
import Food from './components/Food';
import MedicalStatementForm from './components/MedicalStatementForm';
import Training from './components/Training';
import WorkoutDetail from './components/WorkoutDetail';
import ExerciseDetail from './components/ExerciseDetail';
import TrainersMange from './components/admin/TrainersMange'; // Correct path for AdminDashboard
import NotAuthorized from './components/NotAuthorized'; // Correct path for NotAuthorized
import AdminSidebar from './components/admin/AdminSideBar';
import AdminDashBoard from './components/admin/AdminDashboard';
import UserInfo from './components/admin/UserInfo';
import ExercisesList from './components/ExercisesList'; // Adjust the path as necessary
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import AdminCourseManagement from './components/admin/AdminCourseManagement';
// import NutritionList from './components/NutritionList'; // Adjust the path as necessary



function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
}

const Main = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-container">
      {!isAuthPage && user && (user.role === 'admin' ? <AdminSidebar userId={user.id} /> : <Sidebar userId={user.id} />)}
      <div className={`main-content ${user ? '' : 'full-width'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracking-history" element={<TrackingHistory userId={user?.id} />} />
            <Route path="/tracking-food" element={<TrackingFood userId={user?.id} />} />
            <Route path="/tasks" element={<TaskList userId={user?.id} />} />
            <Route path="/recipes" element={<Food />} />
            <Route path="/medical-statement" element={<MedicalStatementForm />} />
            <Route path="/training" element={<Training />} />
            <Route path="/start-workout/:workoutId" element={<WorkoutDetail />} />
            <Route path="/exercise/:exerciseId" element={<ExerciseDetail />} />
            <Route path="/exericses" element={<ExercisesList />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            {/* <Route path = "/naturation-guides" element = {<NutritionList/>} /> */}
          </Route>
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashBoard />} /> {/* Admin route */}
            <Route path="/TrainersMange" element={<TrainersMange />} /> {/* Admin route */}
            <Route path="/user/:userId" element={<UserInfo />} />
            <Route path="/admin/courses" element={<AdminCourseManagement />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;

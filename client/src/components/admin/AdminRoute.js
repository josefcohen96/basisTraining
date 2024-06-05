import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('admin route useEffect');
    console.log(user);
    if (user && user.role === 'admin') {
      console.log('setting admin-user-id header');
      axios.defaults.headers.common['admin-user-id'] = user.id;
    } else {
      delete axios.defaults.headers.common['admin-user-id'];
    }
  }, [user]);

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/not-authorized" />;
};

export default AdminRoute;

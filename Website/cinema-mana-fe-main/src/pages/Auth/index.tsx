import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const RequireAuth: React.FC<Props> = ({ children }) => {
  let { employee } = useAuth();

  if (!employee) {
    console.log('Redirect to login');
    return <Navigate to='/login' />;
  }

  return <>{children}</>;
};

export default RequireAuth;

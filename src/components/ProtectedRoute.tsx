import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // 로딩 중에는 아무것도 렌더링하지 않거나 로딩 스피너를 보여줄 수 있습니다.
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 
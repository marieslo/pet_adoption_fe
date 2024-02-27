import React from 'react';
import './HomePage.css';
import { useAuth } from '../../context/AuthProvider';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page-container">
        {user && (
  
            <div className="home-page-greeting">
              Glad to see you here, 
              <br/>
              {user.firstName} {user.lastName}!
              <br/>
              <br/>
              Transform your life,
            <br/>
            adopt a furry friend today!
            </div>
        )}
      </div>
  );
}
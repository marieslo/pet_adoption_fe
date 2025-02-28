import React from 'react';
import { useAuth } from '../context/AuthProvider';
import PostFeed from '../components/PostFeed';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div
      className="home-page-container"
    >
      {user && (
        <div
          className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-xl md:text-2xl lg:text-3xl text-white text-center px-6 sm:px-12"
          style={{
            color: 'var(--primary-color)', 
            fontFamily: 'var(--font-primary)', 
          }}
        >
          <div>
            Glad to see you here,
            <br />
            {user.firstName} {user.lastName}!
            <br />
            <br />
            Transform your life,
            <br />
            adopt a furry friend today!
          </div>
        </div>
      )}
      <PostFeed />
    </div>
  );
}

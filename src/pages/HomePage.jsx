import React from 'react';
import { useAuth } from '../context/AuthProvider';
import PostFeed from '../components/PostFeed';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div
      className="relative bg-cover bg-right h-screen w-screen z-1"
      style={{ backgroundImage: "url('../../styles/backgrounds/home-page-background.jpg')" }}
    >
      {user && (
        <div
          className="absolute top-0 left-0 mt-48 ml-24 text-xl"
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
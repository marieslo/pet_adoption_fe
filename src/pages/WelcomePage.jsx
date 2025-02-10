import React from 'react';
import PostFeed from '../components/PostFeed';

export default function WelcomePage() {
  return (
    <div className="welcome-page-container bg-cover bg-center w-full h-screen relative flex flex-col items-start p-12 sm:p-5 bg-[url('../../styles/backgrounds/welcome-page-background.jpg')]">
      <section className="welcome-text font-primary text-[#593202] tracking-[-1px] sm:text-sm sm:mt-12 sm:ml-2 sm:w-24 mt-48 ml-36 w-80 text-lg sm:font-medium sm:tracking-normal absolute top-12 left-[-90px] sm:left-0">
        <p>Are you planning to adopt a pet?</p>
        <p className="mt-2">We have dogs, cats, and other</p>
        <p className="mt-2">pets patiently waiting for</p>
        <p className="mt-2">a loving home in need</p>
        <PostFeed />
      </section>
      <div className="welcome-page-petsfeed-container overflow-x-auto whitespace-nowrap flex flex-col items-start sm:w-full sm:mt-5 sm:ml-0 mt-[-320px] ml-60 sm:ml-0 sm:w-full">
        <p className="text-petsfeed-container font-primary text-[#593202] tracking-[-1px] sm:text-sm sm:mt-4 w-96 text-xl sm:text-base mt-[-30px] ml-12 absolute sm:relative">They need your love</p>
      </div>
    </div>
  );
}
import React from 'react';
import './WelcomePage.css';
import ButtonToSearchPage from '../../components/ButtonToSearchPage/ButtonToSearchPage';
import AdoptablePetsFeed from '../../components/AdoptablePetsFeed/AdoptablePetsFeed';

export default function WelcomePage() {
  return (
    <div className='welcome-page-container'>
      <section className='welcome-text'>
        <p>Are you planning to adopt a pet?
          <br/>
          <br/>
            We have dogs, cats, and other
          <br/>
            pets patiently waiting for 
          <br/>
            a loving home in need</p>
      </section>
      
      <ButtonToSearchPage />
      <div className='welcome-page-petsfeed-container'>
      <p className='text-petsfeed-container'>They need your love</p>
        <AdoptablePetsFeed />
      </div>
    </div>
  );
}

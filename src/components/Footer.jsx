import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear(); 
  
  return (
    <footer className="fixed bottom-0 right-0 w-full flex items-center justify-center bg-[#D9C5C1] opacity-70 shadow-[0_-5px_10px_rgba(0,_0,_0,_0.1)] rounded-md font-['Gotu',_sans-serif] text-xs text-center">
      <p className="m-0 text-[12px] text-[#593202]">
        © 2023-{currentYear} made with love
        <a
          className="ml-0 text-[#593202] hover:text-black"
          href="https://www.linkedin.com/in/marie-slovokhotov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}by Marie Slovokhotov
        </a>
      </p>
    </footer>
  );
}
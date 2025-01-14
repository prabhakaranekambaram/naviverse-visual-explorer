import React from 'react';

const MakarLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Saturn Planet */}
      <circle cx="20" cy="20" r="12" fill="#0EA5E9" /> {/* Ocean Blue */}
      
      {/* Saturn Ring */}
      <path
        d="M8 20C8 20 14 16 20 16C26 16 32 20 32 20C32 20 26 24 20 24C14 24 8 20 8 20Z"
        fill="#F2FCE2" /* Soft Green */
        opacity="0.8"
      />
      
      {/* CO2 Molecules */}
      <circle cx="14" cy="12" r="2" fill="#1EAEDB" /> {/* Bright Blue */}
      <circle cx="26" cy="12" r="2" fill="#1EAEDB" />
      <path
        d="M14 12H26"
        stroke="#33C3F0" /* Sky Blue */
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default MakarLogo;
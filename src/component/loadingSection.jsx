import React from 'react';
import './loading-style.css';

const LoadingSection = () => {
  return (
    <div className='loading-container'>
      <div className="loading">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default LoadingSection;

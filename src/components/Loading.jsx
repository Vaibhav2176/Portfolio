import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container bg-alt">
      <div className="cube-wrapper">
        <div className="cube">
          <div className="cube-side front"></div>
          <div className="cube-side back"></div>
          <div className="cube-side right"></div>
          <div className="cube-side left"></div>
          <div className="cube-side top"></div>
          <div className="cube-side bottom"></div>
        </div>
      </div>
      <h2 className="loading-text gradient-text">VAIBHAV.</h2>
    </div>
  );
};

export default Loading;

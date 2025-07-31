// components/LC/LifecycleProgress.js
import React from 'react';
import { STAGES } from './constants';
import './LifecycleProgress.css'; // optional for styling

const LifecycleProgress = ({ currentStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="lifecycle-progress">
      {STAGES.map((stage, index) => (
        <div
          key={stage}
          className={`stage-item ${index < currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}
        >
          <span>{stage}</span>
          {index < STAGES.length - 1 && <div className="arrow">→</div>}
        </div>
      ))}
    </div>
  );
};

export default LifecycleProgress;

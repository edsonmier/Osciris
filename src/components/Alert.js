import React from 'react';

const Alert = ({ message, onClose }) => {
  return (
    <div className="alert">
      {message}
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default Alert;

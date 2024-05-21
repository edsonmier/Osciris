import React, { useState, useEffect } from 'react';
import Alert from './Alert';

const NotificationsBar = ({ alerts }) => {
  return (
    <div className="notification-bar">
      {alerts.map((alert, index) => (
        <Alert key={index} message={alert.message} onClose={() => {/* Lógica para cerrar la alerta */}} />
      ))}
    </div>
  );
};

export default NotificationsBar;

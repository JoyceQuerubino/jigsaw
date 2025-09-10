import React from 'react';
import './RotateDeviceWarning.css';

export function RotateDeviceWarning() {
  return (
    <div className="rotate-device-warning">
      <div className="rotate-device-content">
        <div className="rotate-icon">📱➡️📱</div>
        <h2>Gire seu dispositivo</h2>
        <p>Para uma melhor experiência, por favor gire seu dispositivo para o modo paisagem (horizontal)</p>
      </div>
    </div>
  );
}
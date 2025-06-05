import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  // Default brightness is 100 (meaning 100%)
  const [brightness, setBrightness] = useState(() => {
    const saved = localStorage.getItem('appBrightness');
    return saved ? Number(saved) : 100;
  });

  // Whenever brightness changes, update body filter and localStorage
  useEffect(() => {
    // clamp between 50 and 150
    const clamped = Math.min(150, Math.max(50, brightness));
    document.body.style.filter = `brightness(${clamped}%)`;
    localStorage.setItem('appBrightness', clamped.toString());
  }, [brightness]);

  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>Settings</h1>
      <section style={{ marginTop: '2rem' }}>
        <label htmlFor="brightnessSlider" style={{ display: 'block', marginBottom: '0.5rem' }}>
          App Brightness: {brightness}%
        </label>
        <input
          id="brightnessSlider"
          type="range"
          min="50"
          max="150"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
          Drag the slider to adjust the app’s brightness (50%–150%)
        </p>
      </section>
    </div>
  );
}

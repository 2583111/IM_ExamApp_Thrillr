import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authorization/AuthContext';
import '../Styling/SideBar.css';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Semi‐transparent backdrop */}
      <div className="sidebar-backdrop" onClick={onClose} />

      {/* Sliding panel */}
      <div className="sidebar-panel">
        {/* Close button (X) */}
        <button className="sidebar-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* User area: icon + centered username in grey box */}
        <div className="sidebar-user-container">
          <div className="sidebar-user-icon" />
          <span className="sidebar-username-text">
            {currentUser || 'Guest'}
          </span>
        </div>

        {/* Account/Profile link */}
        <Link to="/profile" className="sidebar-link" onClick={onClose}>
          Account
        </Link>

        {/* Achievements (fires event) */}
        <button
          className="sidebar-link sidebar-link-button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-achievements'));
            onClose();
          }}
        >
          Achievements
        </button>

        {/* Watchlist link (corrected path: "/watchlist") */}
        <Link to="/watchlist" className="sidebar-link" onClick={onClose}>
          Watchlist
        </Link>

        {/* Settings link */}
        <Link to="/settings" className="sidebar-link" onClick={onClose}>
          Settings
        </Link>

        {/* Log Out (only when logged in) */}
        {currentUser && (
          <button
            className="sidebar-logout-btn"
            onClick={() => {
              logout();
              onClose();
              navigate('/');
            }}
          >
            Log Out
          </button>
        )}
      </div>
    </>
  );
}

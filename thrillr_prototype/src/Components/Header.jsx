import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ onToggleSidebar }) {
  return (
    <header
      style={{
        background: 'linear-gradient(to top, #000, #ccc)', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        height: '125px', 
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            fontSize: '4rem',
            fontWeight: 500,
            background: 'linear-gradient(to top, #ff0000, #8b0000)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
            WebkitTextStroke: '1px #888', 
            lineHeight: 1,
          }}
        >
          THRILLR
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: '10rem' }}> 
        <Link to="/" style={navLinkStyle}>Movies</Link>
        <Link to="/series" style={navLinkStyle}>Series</Link>
        <Link to="/social" style={navLinkStyle}>Community</Link>
        <Link to="/lists" style={navLinkStyle}>Lists</Link>
      </nav>

      <button
        onClick={onToggleSidebar}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '2rem',
          cursor: 'pointer',
        }}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
    </header>
  );
}

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.25rem',
  fontWeight: '500',
};

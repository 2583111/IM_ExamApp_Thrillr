import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authorization/AuthContext';

export default function ProfilePage() {
  const { currentUser, isAuthenticated } = useAuth();
  const displayName = isAuthenticated ? currentUser : 'Guest';

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome, {displayName}</h1>

      {isAuthenticated ? (
        <>
          <p>This is your profile page. Review your lists below.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/lists">
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 4,
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Go to My Lists
              </button>
            </Link>
          </div>
        </>
      ) : (
        <p>This is a guest profile. <Link to="/login">Sign in</Link> to see your lists.</p>
      )}
    </div>
  );
}

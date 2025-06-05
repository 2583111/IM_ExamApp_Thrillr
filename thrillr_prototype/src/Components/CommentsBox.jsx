import React, { useState } from 'react';


export default function CommentBox({ onSubmit, disabled }) {
  const [text, setText] = useState('');

  const handleClick = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your review…"
        style={{ width: '100%', padding: '0.5rem' }}
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled || !text.trim()}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: 4,
          background: disabled ? '#AAA' : '#333',
          color: '#fff',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
}

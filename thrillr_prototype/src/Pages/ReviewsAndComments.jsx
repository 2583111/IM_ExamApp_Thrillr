import React, { useState, useEffect } from 'react';
import ReviewItem from '../Components/ReviewItem';
import '../Styling/ListsPages.css'; 

export default function ReviewsAndCommentsPage() {
  // — Discussions State —
  const [discussions, setDiscussions] = useState([]);
  const [headingInput, setHeadingInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');

  // — Popular Reviews State —
  const [popularReviews, setPopularReviews] = useState([]);

  useEffect(() => {
    const rawDiscussions = localStorage.getItem('thrillrDiscussions');
    if (rawDiscussions) {
      try {
        setDiscussions(JSON.parse(rawDiscussions));
      } catch {
        console.error('Failed to parse discussions from localStorage');
        setDiscussions([]);
      }
    } else {
      setDiscussions([]);
    }


    const rawReviews = localStorage.getItem('thrillrReviews');
    if (!rawReviews) {
      setPopularReviews([]);
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawReviews);
    } catch {
      console.error('Failed to parse reviews from localStorage');
      parsed = {};
    }

  
    const all = Object.values(parsed).flat();


    const filtered = all
      .filter(r => Array.isArray(r.likes) && r.likes.length > 0)
      .sort((a, b) => b.likes.length - a.likes.length);

    setPopularReviews(filtered);
  }, []);

  const handleAddDiscussion = (e) => {
    e.preventDefault();
    if (!headingInput.trim() || !bodyInput.trim()) {
      return;
    }

    const newEntry = {
      id:        Date.now(),
      heading:   headingInput.trim(),
      body:      bodyInput.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...discussions];
    setDiscussions(updated);
    localStorage.setItem('thrillrDiscussions', JSON.stringify(updated));

    setHeadingInput('');
    setBodyInput('');
  };

  return (
    <div className="lists-container">
      <div className="list-title-wrapper">
        <h2 className="list-title">Discussions &amp; Popular Reviews</h2>
      </div>

      {/* New Discussion Form */}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Start a New Discussion</h2>
        <form onSubmit={handleAddDiscussion}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label htmlFor="headingInput" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Heading:
            </label>
            <input
              id="headingInput"
              type="text"
              value={headingInput}
              onChange={(e) => setHeadingInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
              placeholder="Discussion heading…"
              required
            />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label htmlFor="bodyInput" style={{ display: 'block', marginBottom: '0.25rem' }}>
              Body:
            </label>
            <textarea
              id="bodyInput"
              rows={4}
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: 4,
                border: '1px solid #ccc',
              }}
              placeholder="Discussion details…"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 4,
              background: '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Post Discussion
          </button>
        </form>
      </section>

      {/* List of Discussions */}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>All Discussions</h2>
        {discussions.length === 0 ? (
          <p style={{ color: '#666' }}>No discussions posted yet.</p>
        ) : (
          discussions.map((d) => (
            <div
              key={d.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: 4,
                padding: '1rem',
                marginBottom: '1rem',
                background: '#fafafa',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{d.heading}</h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>{d.body}</p>
              <small style={{ color: '#888' }}>
                {new Date(d.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </section>

      {/* Popular Reviews */}
      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Popular Reviews</h2>
        {popularReviews.length === 0 ? (
          <p style={{ color: '#666' }}>No reviews with likes yet.</p>
        ) : (
          popularReviews.map((rev) => (
            <ReviewItem
              key={rev.id}
              review={rev}
              currentUser={null}   
              onLike={() => {}} 
            />
          ))
        )}
      </section>
    </div>
  );
}

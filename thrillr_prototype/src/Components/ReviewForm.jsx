import React, { useState } from 'react';
import { useReviews }      from '../Authorization/ReviewContext';
import { useAuth }         from '../Authorization/AuthContext';
import '../Styling/ReviewSections.css';

export default function ReviewForm({ parentType, parentId }) {
  const { isAuthenticated, currentUser } = useAuth();
  const { addReview } = useReviews();

  const [text, setText]     = useState('');
  const [rating, setRating] = useState(0);       // 1..5
  const [error, setError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('You must be logged in to submit a review.');
      return;
    }
    if (!text.trim()) {
      setError('Review text cannot be empty.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addReview(parentType, parentId, {
        userName: currentUser.displayName || currentUser.email,
        text: text.trim(),
        rating
      });
      if (response && response.success) {
        setText('');
        setRating(0);
      } else {
        setError(response.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('ReviewForm submit error:', err);
      setError('An error occurred, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Renders 5 clickable stars
  const renderStars = () => {
    return [1,2,3,4,5].map(val => (
      <span
        key={val}
        onClick={() => { if (!submitting) setRating(val); }}
        style={{
          cursor: submitting ? 'not-allowed' : 'pointer',
          color: val <= rating ? '#FFD700' : '#CCC'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      {error && <p className="error-text">{error}</p>}

      <div className="star-container">
        {renderStars()}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        placeholder="Write your review…"
        disabled={submitting}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

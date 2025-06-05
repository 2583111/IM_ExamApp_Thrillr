import React from 'react';
import { useAuth }    from '../Authorization/AuthContext';
import { useReviews } from '../Authorization/ReviewContext';
import '../Styling/ReviewSections.css';

export default function ReviewItem({ parentType, parentId, review }) {
  const { currentUser } = useAuth();
  const { likeReview }  = useReviews();

  // Safely get likes array
  const likesArray = Array.isArray(review.likes) ? review.likes : [];
  const hasLiked   = currentUser && likesArray.includes(currentUser.uid);

  const handleLike = async () => {
    if (!currentUser) {
      alert('Please log in to like reviews.');
      return;
    }
    await likeReview(parentType, parentId, review.id, currentUser.uid);
  };

  // Render filled vs. empty stars for review.rating
  const renderRatingStars = () => {
    const filled = review.rating || 0;
    return [1,2,3,4,5].map(val => (
      <span
        key={val}
        style={{
          color: val <= filled ? '#FFD700' : '#CCC'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <div className="user-icon" />
        <div className="user-name">{review.userName}</div>
      </div>

      <div className="review-timestamp">
        {new Date(review.timestamp).toLocaleString()}
      </div>

      <div className="review-rating">
        {renderRatingStars()}
      </div>

      <div className="review-text">{review.text}</div>

      <div className="review-actions">
        <button onClick={handleLike}>
          {hasLiked ? '💔 Unlike' : '❤️ Like'} ({likesArray.length})
        </button>
      </div>
    </div>
  );
}

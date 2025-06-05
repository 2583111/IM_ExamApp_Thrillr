import React from 'react';
import ReviewItem from './ReviewItem';
import '../Styling/ReviewSections.css';

export default function ReviewList({ parentType, parentId, reviews }) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return <p style={{ color: '#666' }}>No reviews yet. Be the first to review!</p>;
  }
  return (
    <div className="review-list">
      {reviews.map(rev => (
        <ReviewItem
          key={rev.id}
          parentType={parentType}
          parentId={parentId}
          review={rev}
        />
      ))}
    </div>
  );
}

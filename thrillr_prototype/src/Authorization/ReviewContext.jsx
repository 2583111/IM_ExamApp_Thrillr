import React, { createContext, useContext, useEffect, useState } from 'react';

// Key under which we persist reviews in localStorage
const STORAGE_KEY = 'thrillrReviews';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [allReviews, setAllReviews] = useState({});

  // Load from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAllReviews(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse reviews from localStorage:', err);
      }
    }
  }, []);

  // Whenever allReviews changes, save back to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
  }, [allReviews]);

  // Return array of reviews for a given parentType/parentId
  function getReviewsForItem(parentType, parentId) {
    const key = `${parentType}-${parentId}`;
    return allReviews[key] || [];
  }

  // Add a new review (with rating) for a given parentType/parentId
  async function addReview(parentType, parentId, { userName, text, rating }) {
    const key = `${parentType}-${parentId}`;
    const newReview = {
      id: Date.now(),                
      userName,
      text,
      rating,                         
      likes: [],                      
      timestamp: new Date().toISOString()
    };

    setAllReviews(prev => {
      const existing = prev[key] || [];
      return { ...prev, [key]: [ newReview, ...existing ] };
    });

    return { success: true, review: newReview };
  }

  // Toggle like/unlike on a review by currentUserId
  async function likeReview(parentType, parentId, reviewId, userId) {
    const key = `${parentType}-${parentId}`;
    setAllReviews(prev => {
      const existing = prev[key] || [];
      const updatedList = existing.map(r => {
        if (r.id !== reviewId) return r;
        const likes = Array.isArray(r.likes) ? r.likes : [];
        const hasLiked = likes.includes(userId);
        return {
          ...r,
          likes: hasLiked ? likes.filter(id => id !== userId) : [ ...likes, userId ]
        };
      });
      return { ...prev, [key]: updatedList };
    });
    return { success: true };
  }

  return (
    <ReviewContext.Provider value={{ getReviewsForItem, addReview, likeReview }}>
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}

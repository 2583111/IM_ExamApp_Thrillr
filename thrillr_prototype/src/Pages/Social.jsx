import React, { useState, useEffect } from 'react';
import ReviewItem from '../Components/ReviewItem';
import { useAuth } from '../Authorization/AuthContext';
import '../Styling/SocialPage.css';

export default function SocialPage() {
  const { currentUser, isAuthenticated } = useAuth();

  const [popularReviews, setPopularReviews] = useState([]);

  const [discussions, setDiscussions] = useState([]);
  const [headingInput, setHeadingInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');

  const [replyingToId, setReplyingToId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});

  // Track which discussion is being edited
  const [editingId, setEditingId] = useState(null);
  const [editHeading, setEditHeading] = useState('');
  const [editBody, setEditBody] = useState('');

  // — Load popular reviews & discussions on mount —
  useEffect(() => {
    // 1) Load Popular Reviews
    const rawReviews = localStorage.getItem('thrillrReviews');
    if (rawReviews) {
      let parsed;
      try {
        parsed = JSON.parse(rawReviews);
      } catch {
        console.error('Failed to parse reviews from localStorage');
        parsed = {};
      }
      const all = Object.values(parsed).flat();
      const filtered = all
        .filter((r) => Array.isArray(r.likes) && r.likes.length > 0)
        .sort((a, b) => b.likes.length - a.likes.length);
      setPopularReviews(filtered);
    } else {
      setPopularReviews([]);
    }


    const rawDiscussions = localStorage.getItem('thrillrDiscussions');
    if (rawDiscussions) {
      try {
        const parsed = JSON.parse(rawDiscussions);
        parsed.forEach((d) => {
          if (!Array.isArray(d.replies)) d.replies = [];
          if (!Array.isArray(d.likes)) d.likes = [];
        });
        parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setDiscussions(parsed);
      } catch {
        console.error('Failed to parse discussions from localStorage');
        setDiscussions([]);
      }
    } else {
      setDiscussions([]);
    }
  }, []);

  // Persist discussions whenever they change
  useEffect(() => {
    localStorage.setItem('thrillrDiscussions', JSON.stringify(discussions));
  }, [discussions]);

  // — Add a New Discussion —
  const handleAddDiscussion = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('You must be logged in to start a discussion.');
      return;
    }
    if (!headingInput.trim() || !bodyInput.trim()) {
      alert('Both heading and body are required.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      userName: currentUser,
      heading: headingInput.trim(),
      body: bodyInput.trim(),
      timestamp: new Date().toISOString(),
      replies: [],
      likes: [],
    };

    setDiscussions((prev) => [newEntry, ...prev]);
    setHeadingInput('');
    setBodyInput('');
  };

  // — Delete Discussion (author only) —
  const handleDeleteDiscussion = (discussionId) => {
    if (!window.confirm('Delete this discussion?')) return;
    setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
  };

  // — Edit Discussion (author only) —
  const startEdit = (d) => {
    setEditingId(d.id);
    setEditHeading(d.heading);
    setEditBody(d.body);
  };

  const handleSaveEdit = (discussionId) => {
    if (!editHeading.trim() || !editBody.trim()) {
      alert('Heading and body cannot be empty.');
      return;
    }
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? { ...d, heading: editHeading.trim(), body: editBody.trim() }
          : d
      )
    );
    setEditingId(null);
    setEditHeading('');
    setEditBody('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditHeading('');
    setEditBody('');
  };

  // — Toggle Reply Form —
  const toggleReplyForm = (discussionId) => {
    setReplyingToId((prev) => (prev === discussionId ? null : discussionId));
  };

  const handleReplyChange = (discussionId, text) => {
    setReplyInputs((prev) => ({ ...prev, [discussionId]: text }));
  };

  const handleSubmitReply = (discussionId) => {
    const text = (replyInputs[discussionId] || '').trim();
    if (!isAuthenticated) {
      alert('You must be logged in to reply.');
      return;
    }
    if (!text) {
      alert('Reply cannot be empty.');
      return;
    }
    const newReply = {
      id: Date.now().toString(),
      userName: currentUser,
      text,
      timestamp: new Date().toISOString(),
    };
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, replies: [...d.replies, newReply] } : d
      )
    );
    setReplyInputs((prev) => ({ ...prev, [discussionId]: '' }));
    setReplyingToId(null);
  };

  // — Toggle Like on Discussion —
  const handleToggleDiscussionLike = (discussionId) => {
    if (!isAuthenticated) {
      alert('You must be logged in to like a discussion.');
      return;
    }
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        const alreadyLiked = d.likes.includes(currentUser);
        return {
          ...d,
          likes: alreadyLiked
            ? d.likes.filter((u) => u !== currentUser)
            : [...d.likes, currentUser],
        };
      })
    );
  };

  return (
    <div className="social-page-container">
      <h1 className="community-title">Community</h1>

      {/* —◆ Popular Reviews —◆ */}
      <section className="popular-reviews-section">
        <h2>Popular Reviews</h2>
        {popularReviews.length === 0 ? (
          <p className="no-popular-reviews">No reviews with likes yet.</p>
        ) : (
          popularReviews.map((rev) => (
            <ReviewItem key={rev.id} review={rev} currentUser={null} onLike={() => {}} />
          ))
        )}
      </section>

      {/* —◆ New Discussion Form —◆ */}
      <section className="new-discussion-section">
        <h2>Start a New Discussion</h2>
        <form onSubmit={handleAddDiscussion} className="discussion-form">
          <div className="form-field">
            <label htmlFor="headingInput">Heading:</label>
            <input
              id="headingInput"
              type="text"
              value={headingInput}
              onChange={(e) => setHeadingInput(e.target.value)}
              placeholder="Discussion heading…"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="bodyInput">Body:</label>
            <textarea
              id="bodyInput"
              rows={4}
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              placeholder="Discussion details…"
              required
            />
          </div>
          <button type="submit" className="post-discussion-btn">
            Post Discussion
          </button>
        </form>
      </section>

      {/* —◆ List of Discussions —◆ */}
      <section className="all-discussions-section">
        <h2>All Discussions</h2>
        {discussions.length === 0 ? (
          <p className="no-discussions">No discussions posted yet.</p>
        ) : (
          discussions.map((d) => {
            const hasLiked = d.likes.includes(currentUser);

            return (
              <div key={d.id} className="discussion-card">
                {editingId === d.id ? (
                  <>
                    <input
                      type="text"
                      value={editHeading}
                      onChange={(e) => setEditHeading(e.target.value)}
                      className="edit-heading-input"
                    />
                    <textarea
                      rows={3}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="edit-body-textarea"
                    />
                    <div className="edit-buttons">
                      <button
                        onClick={() => handleSaveEdit(d.id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="discussion-meta">
                      <strong className="discussion-user">{d.userName}</strong> on{' '}
                      {new Date(d.timestamp).toLocaleString()}
                    </p>
                    <h3 className="discussion-heading">{d.heading}</h3>
                    <p className="discussion-body">{d.body}</p>

                    <button
                      onClick={() => handleToggleDiscussionLike(d.id)}
                      className={`like-btn ${hasLiked ? 'liked' : ''}`}
                    >
                      {hasLiked ? 'Unlike' : 'Like'} ({d.likes.length})
                    </button>

                    {isAuthenticated && d.userName === currentUser && (
                      <>
                        <button
                          onClick={() => startEdit(d)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDiscussion(d.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}

                {!editingId && (
                  <button
                    onClick={() => toggleReplyForm(d.id)}
                    className="reply-btn"
                  >
                    {replyingToId === d.id ? 'Cancel Reply' : 'Reply'}
                  </button>
                )}

                {d.replies && d.replies.length > 0 && (
                  <div className="replies-container">
                    {d.replies.map((rep) => (
                      <div key={rep.id} className="reply-card">
                        <p className="reply-meta">
                          <strong className="reply-user">{rep.userName}</strong> on{' '}
                          {new Date(rep.timestamp).toLocaleString()}
                        </p>
                        <p className="reply-text">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replyingToId === d.id && (
                  <div className="reply-form-container">
                    <textarea
                      rows={2}
                      value={replyInputs[d.id] || ''}
                      onChange={(e) => handleReplyChange(d.id, e.target.value)}
                      placeholder="Write your reply…"
                      className="reply-textarea"
                    />
                    <button
                      onClick={() => handleSubmitReply(d.id)}
                      className="submit-reply-btn"
                    >
                      Submit Reply
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

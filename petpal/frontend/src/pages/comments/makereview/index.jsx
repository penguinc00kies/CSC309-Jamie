import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Make = () => {
  const { shelterID } = useParams();
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0); // Initialize rating state
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    get_profile();
  }, []);

  function get_profile() {
    fetch("http://127.0.0.1:8000/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
      .then((request) => request.json())
      .then((json) => {
        console.log('Profile data:', json);
        localStorage.setItem('is_shelter', json.is_shelter.toString());
        setProfile(json);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }

  const sendComment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/shelter/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          comment_user: profile.user_id,
          comment_content: newComment,
          receiving_comment_object: shelterID,
          object_id: shelterID,
          star_rating: newRating,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('Error response:', response);
      }

      const data = await response.json();
      console.log('Response data:', data);

      navigate(`/${shelterID}/shelter/review`);

      setNewComment('');
      setNewRating(0);
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  return (
    <div className="text-center">
      <form style={{ maxWidth: '400px', margin: 'auto', marginTop: '30px', padding: '20px', borderRadius: '10px', backgroundColor: '#f7f7f7' }}>
        <h3 style={{ color: '#334226', marginBottom: '20px' }}>Leave a Review</h3>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Write your review here..."
            rows="6"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ borderRadius: '8px', marginBottom: '20px' }}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label" style={{ color: '#334226', marginBottom: '10px' }}>Rating:</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            min="1"
            max="5"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            style={{ borderRadius: '8px', marginBottom: '20px' }}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={sendComment}
          style={{ backgroundColor: '#334226', color: '#fff', borderRadius: '8px' }}
        >
          Post Review
        </button>
      </form>
    </div>
  );
};

export default Make;

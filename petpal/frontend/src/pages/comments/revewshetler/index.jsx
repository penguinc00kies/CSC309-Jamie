import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Review = () => {
  const { shelterID } = useParams();
  const [comments, setComments] = useState([]);
  const [shelterInfo, setShelterInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
    fetchShelterDetails();

    const intervalId = setInterval(() => {
      fetchComments();
      fetchShelterDetails();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [shelterID]);

  const fetchShelterDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/${shelterID}/view/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching shelter details:', response.status);
        return {};
      }

      const shelterDetails = await response.json();
      console.log('Shelter Details:', shelterDetails);
      setShelterInfo(shelterDetails);
    } catch (error) {
      console.error('Error fetching shelter details:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/${userId}/view/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching user details:', response.status);
        return {};
      }

      const userDetails = await response.json();
      console.log('User Details:', userDetails);
      return userDetails;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return {};
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/${shelterID}/shelter/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching comments:', response.status);
        return;
      }

      const data = await response.json();
      console.log('Fetched Comments:', data);

      const usersDetailsPromises = data.results.map(comment => fetchUserDetails(comment.comment_user));
      const usersDetails = await Promise.all(usersDetailsPromises);

      const commentsWithDetails = data.results.map((comment, index) => ({
        ...comment,
        userDetails: usersDetails[index],
      }));

      setComments(commentsWithDetails);
      console.log('Comments after setting:', commentsWithDetails);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div className="whole-page">
      <div className="container mt-5 text-center">
        <div className="col-lg-8 mx-auto">
        <div className="shelter-info">
            <h1><b>{shelterInfo.name}</b></h1>
            <p><b>Address: {shelterInfo.address}</b></p>
            <p><b>Phone: {shelterInfo.phone}</b></p>
          </div>
          <div id="carouselExample" className="carousel slide text-center carousel-dark mt-4">
            <div className="carousel-inner">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={`${comment.comment_user}_${index}`} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div className="card mx-auto custom-card" style={{ backgroundColor: 'rgba(146, 154, 104, 0.7)' }}>
                      <div className="col-lg-12">
                        <p>{`${comment.star_rating} stars`}</p>
                        <div className="star-rating">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon key={i} icon={faStar} className={`star-icon ${comment.star_rating > i ? 'pink-star' : ''}`} />
                          ))}
                        </div>

                        {comment.userDetails.avatar && (
                          <div className="user-avatar" style={{ backgroundImage: `url(${comment.userDetails.avatar})`, width: '100px', height: '100px', margin: 'auto' }}></div>
                        )}
                        <h5 className={comment.userDetails.avatar ? "mb-3" : "mb-0"} style={{ marginTop: '15px', marginBottom: '10px' }}>{`${comment.userDetails.name}`}</h5>
                        <p>{comment.comment_content}</p>
                        <p>{new Date(comment.comment_time).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="carousel-item active">No comments available</div>
              )}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/${shelterID}/shelter/review/make`)}
            >
              Leave a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;



import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const ModalPage = () => {
  const { applicationID } = useParams();
  console.log(applicationID);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const fetchComments = async (applicationId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/${applicationId}/application/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments(applicationID);
    const intervalId = setInterval(() => {
      fetchComments(applicationID);
    }, 5000);
    get_profile();
    return () => clearInterval(intervalId);
  }, [applicationID]);

  function get_profile() {
    fetch("http://127.0.0.1:8000/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
      .then((request) => request.json())
      .then((json) => {
        console.log('Profile data:', json); // Add this line to log the profile data
        localStorage.setItem('is_shelter', json.is_shelter.toString());
        setProfile(json);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }
  

  const sendComment = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/comments/application/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify({
          comment_user: profile.user_id,
          comment_content: newComment,
          receiving_comment_object: applicationID,
          object_id: applicationID,
          is_application: true,
          star_rating: null
        }),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (!response.ok) {
        console.error('Error response:', response);
      }
      setComments(prevComments => ({ results: [data, ...(prevComments.results || [])] }));
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  return (
    <Modal show={true} onHide={() => navigate(`/application/${applicationID}`)}>
      <Modal.Header closeButton>
        <Modal.Title>Conversation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Card className="conversation-card mx-auto" id="chat2">
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat with the shelter</h5>
            </Card.Header>
            <Card.Body>
              <div className='scroll'>
                {comments.results && comments.results.length > 0 ? (
                  <>
                    {comments.results.slice().reverse().map((comment, index) => (
                      <p
                        key={comment.object_id}
                        className={`small p-2 ms-3 mb-1 rounded-3 ${comment.comment_user == profile.user_id ? 'sent-message' : 'received-message'
                          }`}
                        id="conversation-box"
                      >
                        {comment.comment_content}
                      </p>
                    ))}
                  </>
                ) : (
                  <p>No comments available.</p>
                )}
              </div>
            </Card.Body>
            <Card.Footer className="text-muted d-flex justify-content-start align-items-center p-3">
              <Form.Control
                type="text"
                className="form-control-lg"
                placeholder="Type message"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="primary" className="ms-3" onClick={sendComment}>
                <i className="fa fa-paper-plane"></i>
              </Button>
            </Card.Footer>
          </Card>
        </Container>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center"> 
        <input className="login-btn" onClick={() => navigate(`/application/${applicationID}`)} name="close" type="submit" value="Close" />
      </Modal.Footer>
    </Modal>
  );  
};

export default ModalPage;
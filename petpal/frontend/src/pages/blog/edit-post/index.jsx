import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/placeholder.jpeg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'

function EditPost() {
    const [error, setError] = useState("");
    const [likeError, setLikeError] = useState("");
    const [shelterID, setShelterID] = useState(null);
    const [post, setPost] = useState([]);
    const {postID} = useParams();
    const [mostLiked, setMostLiked] = useState([]);
    const [profile, setProfile] = useState([]);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    

    const navigate = useNavigate();

    function get_post() {
        ajax(`/posts/update/${postID}/`,  {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
        .then(request => {
        if (request.status === 403) {
            setError("403 Forbidden: You don't have permission to view this profile.");
        } else {
            setError("")
            return request.json();
        }})
        .then(json => {
            setPost(json)
        })

    }

    function handleSubmit(event) {
        let data = new FormData(event.target);

        ajax(`/posts/update/${postID}/`, {
            method: "PATCH",
            body: data,
            headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` },
        })
        .then(request => request.json())
        .then(json => {
            navigate("/blog/edit")
            console.log(json)
            // if (!Object.keys(json).includes('is_shelter') ) {
            //     const errorMessages = Object.values(json).flat();
            //     setError(errorMessages.join(', '));
            // }
            // else {
            //     setError("")
            //     // navigate('/login')

            // }
        })
        .catch(error => {
            setError(error);
        });

        event.preventDefault();
    }

    useEffect(() => {
        get_post();
        // This function will be called when the component is mounted
    }, []);


    return (
        <div className='page-div'>

            <div class="header">
                <h2 class="title">Create New Post!</h2>
            </div>

            <div class="blog make">
                <div class="blog centercolumn">
                <form onSubmit={handleSubmit}>
                    <div class="blog card">
                        
                            <label class="form-label" for="title"><h2>Title:</h2></label>
                            <input class="login" name="title" id="title" type="text" defaultValue={post.title} required/>
                            <h5>{post.date}</h5>
                            <label for="post">Post Content:</label>
                            <div class="textbox"><textarea name="post" id="post" defaultValue={post.post} className='content' rows="4"></textarea></div>
                            <div className='likes'>
                                <p><b>Likes: {post.likes}</b></p>

                            </div>
                            
                        
                    </div>
                    <div className='centered-div'>
                        <input class="login-btn" name="submit" type="submit" value="Update Post"/>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )

}

export default EditPost;
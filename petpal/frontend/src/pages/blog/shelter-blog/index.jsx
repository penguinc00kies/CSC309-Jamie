import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/placeholder.jpeg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'

function ViewBlog() {
    const [error, setError] = useState("");
    const [likeError, setLikeError] = useState("");
    const { shelterID } = useParams();
    const [posts, setPosts] = useState([]);
    const [mostLiked, setMostLiked] = useState([]);
    const [profile, setProfile] = useState([]);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)

    const navigate = useNavigate();

    function get_posts(url) {
        let nav;
        if (url !== undefined) {
            const regex = /\/posts(\/?.*)/;
            const match = url.match(regex);
            nav = match ? match[1] : null;
            nav = `/posts${nav}`;
        }
        else {
            nav = `/posts/list/${shelterID}/`
        }
        console.log(`Nav = ${nav}`)
        
        
        ajax(nav, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
        })
            .then(request => {
                if (request.status === 403) {
                    setError("403 Forbidden: You don't have permission to view this profile.");
                } else {
                    setError("")
                    return request.json();
                }
            })
            .then(json => {
                setPosts(json.results)
                setNext(json.next)
                setPrev(json.previous)
                // setError(JSON.stringify(json))
            })

    }

    function get_most_liked() {
        ajax(`/posts/list/most_liked/${shelterID}/`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
        })
            .then(request => {
                if (request.status === 403) {
                    setError("403 Forbidden: You don't have permission to view this profile.");
                } else {
                    setError("")
                    return request.json();
                }
            })
            .then(json => {
                setMostLiked(json.results)
                // setError(JSON.stringify(json))
            })

    }

    function get_profile() {
        ajax(`/${shelterID}/info/`,  {
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
            setProfile(json)
        })
        
    }
    function handleNext() {
        if (next !== null) {
            get_posts(next);
        }
    };

    function handlePrev() {
        if (prev !== null) {
            get_posts(prev);
        }
    };

    function handleLike(id) {
        console.log(id)
        ajax(`/posts/like/${id}/`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
        })
        .then(response => {
            if (response.ok) {
                setPosts(prevPosts => {
                    return prevPosts.map(post => {
                        if (post.id === id) {
                            // Increment the likes count for the liked post
                            return { ...post, likes: post.likes + 1 };
                        }
                        return post;
                    });
                });

                }
            else {
                return response.text().then(error_text => {
                    setLikeError(error_text);
                })
            }
        })
        // .then( json => {console.log(json.error)})
    }

    useEffect(() => {
        // This function will be called when the component is mounted

        get_posts();
        get_profile();
        get_most_liked();
    }, []);


    return (
        <div className='page-div'>
            
            <div class="header">
                <h2 class="title">{profile.name}'s Blog!</h2>
            </div>
            <p>{likeError}</p>

            <div class="blog row">
                <div class="blog leftcolumn">
                    {posts.map(post => (
                        <div class="blog card">
                            <h2>{post.title}</h2>
                            <h5>{post.date.split('T')[0]}</h5>
                            <div class="textbox">{post.post}</div>
                            <div className='likes'>
                            <p><b>Likes: {post.likes}</b></p>
                            <Button className='btn nav-btn' onClick={() => handleLike(post.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                </svg>
                            </Button>
                            </div>
                        </div>
                    ))}

                    <div className='centered-btn-div'>
                    <Button className='nav-btn' onClick={handlePrev}>Prev</Button>
                    <Button className='nav-btn' onClick={handleNext}>Next</Button>
                    </div>
                </div>
                <div class="blog rightcolumn">
                    <div class="blog card">
                        <h2>{profile.name}'s Bio</h2>
                        <div class="textbox_sml">{profile.description}</div>
                    </div>
                    <div class="blog card">
                    <h3><b>Popular Posts</b></h3>
                    {mostLiked.map(most => (
                        <div>
                            <div class="textbox"><h4>{most.title}</h4><p>{most.post}</p></div><br/>
                            <p><b>Likes: {most.likes}</b></p>
                        </div>
                    ))}
                    </div>

                    

                </div>
            </div>
        </div>
    )

}

export default ViewBlog;
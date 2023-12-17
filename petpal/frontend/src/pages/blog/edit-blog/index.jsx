import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/placeholder.jpeg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'

function EditBlog() {
    const [error, setError] = useState("");
    const [likeError, setLikeError] = useState("");
    const [shelterID, setShelterID] = useState(null);
    const [posts, setPosts] = useState([]);
    const [mostLiked, setMostLiked] = useState([]);
    const [profile, setProfile] = useState([]);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)

    const navigate = useNavigate();

    function get_posts(url, id, id_flag) {
        let nav;
        if (url !== undefined && !id_flag) {
            const regex = /\/posts(\/?.*)/;
            const match = url.match(regex);
            nav = match ? match[1] : null;
            nav = `/posts${nav}`;
        }
        else {
            nav = `/posts/list/${id}/`
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

    function get_most_liked(id) {
        console.log(`Most liked:${id}`)
        ajax(`/posts/list/most_liked/${id}/`, {
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

    // function get_profile() {
    //     ajax(`/${shelterID}/info/`,  {
    //         method: "GET",
    //         headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
    //     })
    //     .then(request => {
    //     if (request.status === 403) {
    //         setError("403 Forbidden: You don't have permission to view this profile.");
    //     } else {
    //         setError("")
    //         return request.json();
    //     }})
    //     .then(json => {
    //         setProfile(json)
    //     })
        
    // }
    function get_profile() {
        let shelter_id;
        ajax("/profile",  {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
        .then(request => request.json())
        .then(json => {
            setProfile(json)
            shelter_id = json.user_id;
            
        })
        .then(() => get_posts(undefined, shelter_id, true))
        .then(() => get_most_liked(shelter_id))
        
    }
    function handleNext() {
        if (next !== null) {
            get_posts(next, 0, false);
        }
    };

    function handlePrev() {
        if (prev !== null) {
            get_posts(prev, 0, false);
        }
    };
    

    function handleDelete(id) {
        console.log(id)
        ajax(`/posts/deletion/${id}/`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => {setPosts(posts.filter(post => post.id !== id));})

    }
    function handleNavigate(id) {
        navigate(`/blog/update/${id}`);
    }

    useEffect(() => {
        // This function will be called when the component is mounted

        get_profile();
        // get_posts();
        // get_most_liked();
    }, []);




    return (
        <div className='page-div'>
            
            <div class="header">
                <h2 class="title">{profile.name}'s Blog!</h2>
            </div>
            

            <p>{likeError}</p>

            <div class="blog row">
                <div class="blog leftcolumn">
                <Button className='btn make-btn' onClick={() => navigate("/blog/post")}>Make New Post</Button>
                    {posts.map(post => (
                        <div class="blog card">
                            <h2>{post.title}</h2>
                            <h5>{post.date.split('T')[0]}</h5>
                            <div class="textbox">{post.post}</div>
                            <div className='likes'>
                          <Button className='btn nav-btn edit' onClick={() => handleNavigate(post.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>
                            </Button>
                            <Button className='btn nav-btn del' onClick={() => handleDelete(post.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg></Button>
                            <p><b>Likes: {post.likes}</b></p>
                            <Button className='btn nav-btn'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
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

export default EditBlog;
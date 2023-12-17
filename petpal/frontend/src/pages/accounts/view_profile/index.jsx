import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/placeholder.jpeg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'

function ViewProfile() {
    const [error, setError] = useState("");
    const { userID } = useParams();
    const [ profile, setProfile ] = useState([]);
    const navigate = useNavigate();

    function get_profile() {
        ajax(`/${userID}/info/`,  {
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

    useEffect(() => {
        // This function will be called when the component is mounted
        get_profile();
    }, []);


    if (error !== "") {
        return (<p>{error}</p>)
    }
    else{
        return (
            <div class="twocolumns">
            <div class="leftside">
                <p class="pfptitle">{profile['name']}'s Profile Picture</p>
                <div class="imgcontainer">
                    <img class="pfp" src={profile['avatar'] === null ? pfpHolder : profile['avatar']} alt="Card image cap"/>
                </div>
                {profile['is_shelter'] === true ? (                <div className='centered-div'>
                <Button className='btn nav-btn blog' onClick={() => navigate(`/blog/${profile['user_id']}`)}>View Blog</Button>
                <Button className='btn nav-btn blog' onClick={() => navigate(`/${profile['user_id']}/shelter/review`)}>Review</Button>
                </div>) : <p></p>}

            </div>
            <form class="rightside">
                <div class="spacer"></div>
                <div class="insidebox"><label for="name">Name:</label></div>
                <div class="insidebox"><input name="name" type="text" defaultValue={profile['name']} readOnly/></div>
                <div class="insidebox"><label for="email">Email:</label></div>
                <div class="insidebox"><input name="email" type="text" defaultValue={profile['email']} readOnly/></div>
                <p class="errormessage">Email already in use!</p>
                <div class="insidebox"><label for="phone">Phone Number:</label></div>
                <div class="insidebox"><input name="phone" type="number" defaultValue={profile['phone']} readOnly/></div>
                <div class="insidebox"><label for="address">Address:</label></div>
                <div class="insidebox"><input name="address" type="text" defaultValue={profile['address']} readOnly/></div>
                <p class="errormessage">Phone number already in use!</p>
                <div class="insidebox"><label for="description">Description:</label></div>
                <div class="insidebox"><textarea name="description" id="description" rows="4" defaultValue={profile['description'] } readOnly></textarea></div>
                <input class="is_shelter" name="is_shelter" type="checkbox" checked={localStorage.getItem('is_shelter') === "true" ? "checked" : ""} />
                <div class="centered-div">
                </div>
            </form>
            

            <div class="spacer"></div>
        </div>)
        }

}

export default ViewProfile;
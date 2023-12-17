import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/placeholder.jpeg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'

function Update() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState([])
    const navigate = useNavigate();

    function handle_submit(event) {
        let data = new FormData(event.target);
        let errors = [];

        ajax("/profile/", {
            method: "PATCH",
            body: data,
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
        .then(request => request.json())
        .then(json => {
            if (!Object.keys(json).includes('email')) {
                const errorMessages = Object.values(json).flat();
                setError(errorMessages.join(', '));
                setSuccess("")
                // setError(JSON.stringify(json))
            }
            else {
                setError("")
                get_profile();
                setSuccess("Profile successfully updated!")

            }
            
        })
        .catch(error => {
            setError(error);
        });

        event.preventDefault();
    }

    function get_profile() {
        ajax("/profile",  {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
        .then(request => request.json())
        .then(json => {
            localStorage.setItem('is_shelter', (json.is_shelter).toString())
            // setError(JSON.stringify(json))
            setProfile(json)
        })
        
    }

    function delete_user() {
        ajax("/profile",  {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
        .then(navigate("/"))
    }

    useEffect(() => {
        // This function will be called when the component is mounted
        get_profile();
    }, []);



    return (
        <div class="twocolumns">
        <div class="leftside">
            <p class="pfptitle">Your Profile Picture</p>
            <div class="imgcontainer">
                <img class="pfp" src={profile['avatar'] === null ? pfpHolder : profile['avatar']} alt="Card image cap"/>
            </div>
            <div class="formcontainer">
            {/* <form action="https://postman-echo.com/post" method="post" enctype="multipart/form-data"> */}
                <form enctype="multipart/form-data" onSubmit={handle_submit}>
                    <div id="pfpupload"><input type="file" id="avatar" name="avatar" accept="image/*"/></div>
                    <div className="centered-div">
                    <button type="submit" id="submit">Submit!</button>
                    </div>
                </form>
            </div>
        </div>
        <form class="rightside" onSubmit={handle_submit}>
            <div class="spacer"></div>
            <div class="insidebox"><label for="name">Name:</label></div>
            <div class="insidebox"><input name="name" type="text" defaultValue={profile['name']} /></div>
            <div class="insidebox"><label for="email">Email:</label></div>
            <div class="insidebox"><input name="email" type="text" defaultValue={profile['email']} readOnly/></div>
            <p class="errormessage">Email already in use!</p>
            <div class="insidebox"><label for="phone">Phone Number:</label></div>
            <div class="insidebox"><input name="phone" type="number" defaultValue={profile['phone']} /></div>
            <div class="insidebox"><label for="address">Address:</label></div>
            <div class="insidebox"><input name="address" type="text" defaultValue={profile['address']} /></div>
            <p class="errormessage">Phone number already in use!</p>
            <div class="insidebox"><label for="description">Description:</label></div>
            <div class="insidebox"><textarea name="description" id="description" rows="4" defaultValue={profile['description']}></textarea></div>
            <div class="insidebox"><label for="password">Password:</label></div>
            <div class="insidebox"><input name="password" type="password" defaultValue={""} /></div>
            <div class="insidebox"><label for="password_confirm" >Password Confirm:</label></div>
            <div class="insidebox"><input name="password_confirm" defaultValue={""} type="password" /></div>
            <input class="is_shelter" name="is_shelter" type="checkbox" checked={localStorage.getItem('is_shelter') === "true" ? "checked" : ""} />
            <button class="insidebox" type="submit" id="change">Save Changes</button>
            <div class="centered-div">
            <p className='error-msg'>{error}</p>
            <p className='success-msg'>{success}</p>
            </div>
        </form>
        <div class="centered-div delete">
        <div class="center-button delete">
                <button className="delete" onClick={delete_user}>DELETE ACCOUNT</button>
        </div>
        </div>
        

        <div class="spacer"></div>
    </div>)

}

export default Update;
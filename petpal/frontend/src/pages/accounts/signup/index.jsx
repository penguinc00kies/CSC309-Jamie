import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'

function Signup() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handle_submit(event) {
        let data = new FormData(event.target);

        ajax("/accounts/", {
            method: "POST",
            body: data,
        })
        .then(request => request.json())
        .then(json => {
            console.log(json)
            if (!Object.keys(json).includes('is_shelter') ) {
                const errorMessages = Object.values(json).flat();
                setError(errorMessages.join(', '));
            }
            else {
                setError("")
                navigate('/login')

            }
        })
        .catch(error => {
            setError(error);
        });

        event.preventDefault();
    }

    return (
    <div>
        <div class="signup-container">
                    <input class="radio" id="seeker" name="signup-options" type="radio" checked/>
                    <input class="radio" id="shelter" name="signup-options" type="radio"/>
                    
                    <div class="options">
                        <label class="tab" id="seeker-select" for="seeker">Seeker</label>
                        <label class="tab" id="shelter-select" for="shelter">Shelter</label>
                    </div>

                    <div class="signup-forms">
                        <div class="signup-form" id="seeker-form">
                            <form class="signup" onSubmit={handle_submit}>
                                <label class="form-label" for="email">Email:</label>
                                <input class="login" name="email" id="email" type="email" required/>

                                <label class="form-label" for="name">Full Name:</label>
                                <input class="login" name="name" id="name" type="text" required/>

                                <label class="password-label" for="password">Password:</label>
                                <input class="login" name="password" id="password" type="password" required/>

                                <label class="password-label" for="password_confirm">Password Confirm:</label>
                                <input class="login" name="password_confirm" id="password_confirm" type="password" required/>

                                <label class="form-label" for="phone">Phone:</label>
                                <input class="login" name="phone" id="phone" type="text"/>

                                <label class="form-label" for="address">Address:</label>
                                <input class="login" name="address" id="address" type="text"/>

                                <label class="form-label" for="description">Description:</label>
                                <input class="login" name="description" id="description" type="text"/>

                                <label class="form-label" for="avatar">Avatar:</label>
                                <input class="login" name="avatar" id="avatar" type="file" accept="image/*"/>

                                <input class="is_shelter" name="is_shelter" type="checkbox" checked="" />
                                <p name="test" id="test">{error}</p>

                                <input class="login-btn" name="submit" type="submit" value="SIGN UP"/>
                            </form>
                        </div>
                        <div class="signup-form" id="shelter-form">
                            <form class="signup" onSubmit={handle_submit}>
                                <label class="form-label" for="email">Email:</label>
                                <input class="login" name="email" id="email" type="email" required/>

                                <label class="form-label" for="name">Shelter Name:</label>
                                <input class="login" name="name" id="name" type="text" required/>


                                <label class="password-label" for="password">Password:</label>
                                <input class="login" name="password" id="password" type="password" required/>

                                <label class="password-label" for="password_confirm">Password Confirm:</label>
                                <input class="login" name="password_confirm" id="password_confirm" type="password" required/>

                                <label class="form-label" for="phone">Phone:</label>
                                <input class="login" name="phone" id="phone" type="text"/>

                                <label class="form-label" for="address">Address:</label>
                                <input class="login" name="address" id="address" type="text"/>

                                <label class="form-label" for="description">Description:</label>
                                <input class="login" name="description" id="description" type="text"/>

                                <label class="form-label" for="avatar">Avatar:</label>
                                <input class="login" name="avatar" id="avatar" type="file" accept="image/*"/>

                                <input class="is_shelter" name="is_shelter" type="checkbox" checked="checked" />
                                <p name="test" id="test">{error}</p>

                                <input class="login-btn" name="submit" type="submit" value="SIGN UP"/>
                            </form>
                        </div>
                    </div>
                </div>
                
    </div>)

}

export default Signup;
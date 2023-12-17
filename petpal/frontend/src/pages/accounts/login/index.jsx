import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'

function Login() {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handle_submit(event) {
        let data = new FormData(event.target);

        ajax("/api/token/", {
            method: "POST",
            body: data,
        })
        .then(request => request.json())
        .then(json => {
            if ('access' in json) {
                localStorage.setItem('access', json.access);
                localStorage.setItem('email', data.get('email'));
                navigate('/update');
            }
            else if ('detail' in json) {
                setError(json.detail);
            }
            else {
                setError(`Error: ${JSON.stringify(json)}`)
            }
        })
        .catch(error => {
            setError(error);
        });

        event.preventDefault();
    }

    return (
    <div className='page-container'>
    <Box type="round-rect center login">
    <h1 class="welcome">Welcome back!</h1>

    <form class="login" onSubmit={handle_submit}>

    <label class="username-label" for="email">Email:</label>
    <input class="login" name="email" id="email" type="text" required/>

    <label class="password-label" for="password">Password:</label>
    <input class="login" name="password" id="password" type="password" required/>

    <input class="login-btn" name="submit" type="submit" value="LOGIN"/>
    <p className="error">{error}</p>
    </form>
    </Box>
    </div>)

    {/* </form>

     <form id="login" onSubmit={handle_submit}>
        <h2>Please enter your login information</h2>
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" name="username" required />
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" required  />
        <div className="offset-1">
            <button className="btn" type="submit">Login</button>
        </div>
        <p className="error">{error}</p>
    </form> */}

}

export default Login;
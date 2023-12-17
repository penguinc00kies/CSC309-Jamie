import { Outlet, Link, useLocation } from "react-router-dom"
import './style.css';
import tempLogo from '../../assets/temp-logo.webp';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect } from "react";
import { ajax } from "../../pages/ajax";

const Layout = () => {

    const [show, setShow] = useState(false);
    const [profile, setProfile] = useState([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const location = useLocation();
    const url = location.pathname;
    const is_shelter = (localStorage.getItem('is_shelter') === "true");
    const logged_in = (localStorage.getItem('access') != null)
    let navigate = useNavigate();
    const routeChange = () => {
        let path = `newPath`;
        navigate(path);
    }

    // function get_profile() {
    //     if (logged_in) {
    //         ajax("/profile", {
    //             method: "GET",
    //             headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
    //         })
    //         .then(request => request.json())
    //         .then(json => {
    //             localStorage.setItem('is_shelter', (json.is_shelter).toString())
    //             // setError(JSON.stringify(json))
    //             setProfile(json)
    //         })
    //     }

    // }
    function logout() {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        // This function will be called when the component is mounted
        const get_profile = async () => {
            if (logged_in) {
                try {
                    const user_info = await ajax("/profile", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
                    });
                    const json = await user_info.json();

                    localStorage.setItem('is_shelter', (json.is_shelter).toString())
                    // setError(JSON.stringify(json))
                    setProfile(json)
                } catch (error) {
                    localStorage.setItem('is_shelter', 'false');
                }

            }
        }

        get_profile();
    }, [logged_in]);
    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
                <title>Landing</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
                    crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>

                <script
                    src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
                    crossorigin></script>

                <script
                    src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
                    crossorigin></script>
                <link rel="stylesheet" href="style.css" />
            </head>
            <body className={url === "/" || "update" ? "landing" : ""}>
                <div className={url === "/signup" ? "page-container signup" : "page-container"}>

                    <header>
                        <a class="navbar-brand" href="#">
                            <img class="logo" src={tempLogo} />
                        </a>


                        <nav class="navbar navbar-expand-lg ">
                            <div class="container-fluid">
                                {/* 
                                <button onHide={handleShow} responsive="lg" class="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                                    data-bs-target="#CollapsedNav" aria-controls="CollapsedNav" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button> */}
                                <button className="btn d-lg-none" onClick={handleShow}>
                                    Navigation
                                </button>
                                {/* <button responsive="lg" show={show} className="btn" onClick={handleShow}>
                                        Navigation
                                </button> */}
                                <div class="offcanvas offcanvas-end" tabindex="-1" id="CollapsedNav">




                                    <Offcanvas show={show} onHide={handleClose} placement="end" responsive="lg">
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title>NAVIGATION</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">

                                                {logged_in ? (
                                                    <>
                                                        <Link class={url === '/' ? "nav-link active" : "nav-link"} to="/">Home</Link>
                                                        <Link class={url === '/blog/edit' || url === '/view_shelters' ? "nav-link active" : "nav-link"} to={is_shelter ? '/blog/edit' : '/view_shelters'}>{is_shelter ? 'Blog' : 'Shelters'}</Link>
                                                        {is_shelter ? <Link class={url === '/applications' ? "nav-link active" : "nav-link"} to='/applications'>Applications</Link> : <></>}
                                                        <Link class={url === '/listings/creation' || url === '/applications' && !is_shelter ? "nav-link active" : "nav-link"} to={is_shelter ? '/mylistings' : '/applications'}>{is_shelter ? 'Pets' : 'Applications'}</Link>
                                                        {/* <Dropdown>
                                                            <Dropdown.Toggle class="btn">
                                                                Notifications
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu class="drp-menu">
                                                                <Dropdown.Item class="drp-item" href="#">Notification</Dropdown.Item>
                                                                <Dropdown.Item class="drp-item" href="#">Notification</Dropdown.Item>
                                                                <Dropdown.Item class="drp-item" href="#">Notification</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown> */}
                                                        <Link class={url === '/notifications' ? "nav-link active" : "nav-link"} to="/notifications/list">Notifications</Link>

                                                        {/* <div class="dropdown">
                                                            <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                                                aria-expanded="false">
                                                                Profile
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li>
                                                                    <div class="profile"><img class="pfp" src="images/profile.jpg" alt="Profile" /> </div>
                                                                </li>
                                                                <li>
                                                                    <p class="dropdown-item">Username</p>
                                                                </li>
                                                                <li>
                                                                    <hr class="dropdown-divider" />
                                                                </li>
                                                                <li><a class="dropdown-item" href="account_update_user.html">Edit Profile</a></li>
                                                            </ul>
                                                        </div> */}
                                                        <Link class={url === '/update' ? "nav-link active" : "nav-link"} to="/update">Profile</Link>
                                                        <Link class={url === '/search' ? "nav-link active" : "nav-link"} to="/listings">Search</Link>
                                                        <Link className="nav-link" to="/" onClick={logout}>Log Out</Link>
                                                    </>
                                                ) :
                                                    (<><Link class={url === '/' ? "nav-link active" : "nav-link"} to="/">Home</Link></>)}



                                            </ul>
                                        </Offcanvas.Body>
                                    </Offcanvas>
                                </div>
                            </div>


                        </nav>
                    </header>
                    <main className={url === "/" ? "landing" : ""}>

                        <Outlet />

                    </main>

                    <footer>Copyright Charlie, Dina, Jamie, Selin 2023</footer>
                </div>
            </body>
        </>
    )
}

export default Layout;
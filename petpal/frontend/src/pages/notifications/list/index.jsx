import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax, ajax_no_domain, ajax_or_login } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/profile.jpg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'
import DisplayCard from '../../../components/common/display-card';
import NotificationCard from '../../../components/common/notification-card';



function NotificationsList() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState("")
    const [ query, setQuery ] = useState({read:"", offset: 0})
    // const [page, setPage] = useState(1);

    const [load, setLoad] = useState(false);


    const [notifications, setNotifications] = useState([]);
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    // const { setPage } = useContext(APIContext);
    const navigate = useNavigate();

    var end_flag = false;
    var last_para = 1;

    useEffect(() => {
        get_all_notifs();
    }, [query]);

    // useEffect(() => {
    //     const {read, offset} = query
    //     ajax(`/notifications/?read=${read}limit=3&offset=${offset}`, {
    //         method: "GET",
    //         headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
    //     })
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log(JSON.stringify(json))
    //             setNotifications(json.results);
    //             setNext(json.next)
    //             setPrev(json.previous)
    //             // setError(JSON.stringify(json))
    //         });
    // }, []);

    function get_all_notifs() {
        const {read, offset} = query
        ajax_or_login(`/notifications/?read=${read}&limit=3&offset=${offset}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => response.json())
            .then(json => {
                console.log(JSON.stringify(json))
                setNotifications(json.results);
                setNext(json.next)
                setPrev(json.previous)
                // setError(JSON.stringify(json))
            }, navigate);
    }


    function get_notifications(url) {
        ajax_no_domain(url, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => response.json())
            .then(json => {
                console.log(JSON.stringify(json))
                setNotifications(json.results);
                setNext(json.next);
                setPrev(json.previous);
                // setError(JSON.stringify(json))
            });
    }

    function handleNext() {
        if (next !== null) {
            get_notifications(next);
        }
    };

    function handlePrev() {
        if (prev !== null) {
            get_notifications(prev);
        }
    };

    function handleView(link) {
        navigate(link);

        // ajax(`/${id}/link`, {
        //     method: "GET",
        //     headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        // })
        //     .then(response => response.json())
        //     .then(json => console.log(JSON.stringify(json)))

    } 

    function handleDelete(id) {
        console.log(id)
        ajax(`/${id}/deletion`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => {setNotifications(notifications.filter(notification => notification.id !== id));})

    }




    return (
        <div>
            <div className='centered-div'>
                <h1 className='title'>Notifications</h1>

            </div>
            <div className='centered-div mb'>
                <label for="filter"><h3>Filter Notifications: </h3></label>
            <select className='notif-filter' id="filter" name="filter" onChange={event => setQuery({...query, read: event.target.value, offset: 0})}>
                    <option value="">All</option>
                    <option value="true">Read</option>
                    <option value="false">Unread</option>
                </select>
            </div>

            <div className='centered-div'>

                <div className='cards-container'>
                    {notifications.map(notification => (
                        <div className='card-item' key={notification.id}>
                            <NotificationCard title="Notification" text={notification.text} read={notification.read ? "Status: Read" : "Status: Unread" } del={() => handleDelete(notification.id)} link={notification.link} view={() => handleView(notification.link)}   />
                        </div>
                    ))}
                </div>


            </div>
            <div className='centered-div'>
            <button className='login-btn direct-er' onClick={handlePrev}>Previous</button>
            
                <button className='login-btn direct-er' onClick={handleNext}>Next</button>
                </div>

        </div>
    );

}

export default NotificationsList;
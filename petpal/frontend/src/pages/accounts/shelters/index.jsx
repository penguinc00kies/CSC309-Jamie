import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax, ajax_no_domain } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/profile.jpg'
import Button from 'react-bootstrap/esm/Button';
import ButtonLink from '../../../components/common/button-link'
import DisplayCard from '../../../components/common/display-card';

function Shelters() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState("")
    // const [page, setPage] = useState(1);

    const [load, setLoad] = useState(false);


    const [shelters, setShelters] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [query, setQuery] = useState({ page: 1 });
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    // const { setPage } = useContext(APIContext);
    const navigate = useNavigate();

    var end_flag = false;
    var last_para = 1;

    useEffect(() => {
        ajax("/shelters", {
            method: "GET",
            // headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
        })
            .then(response => response.json())
            .then(json => {
                console.log(JSON.stringify(json))
                setShelters(json.results);
                setNext(json.next)
                setPrev(json.previous)
                // setError(JSON.stringify(json))
            });
    }, []);


    function get_shelters(url) {
        ajax_no_domain(url, {
            method: "GET",
        })
            .then(response => response.json())
            .then(json => {
                console.log(JSON.stringify(json))
                setShelters(json.results);
                setNext(json.next);
                setPrev(json.previous);
                // setError(JSON.stringify(json))
            });
    }

    function handleNext() {
        if (next !== null) {
            get_shelters(next);
        }
    };

    function handlePrev() {
        if (prev !== null) {
            get_shelters(prev);
        }
    };

    // useEffect(() => {
    //     // This function will be called when the component is mounted
    //     get_shelters();
    // }, []);


    return (
        <div>
            <div className='centered-div'>
                <h1 className='title'>SHELTERS</h1>
            </div>

            <div className='centered-div'>

                <div className='cards-container'>
                    {shelters.map(shelter => (
                        <div className='card-item' key={shelter.id}>
                            <DisplayCard title={shelter.name} src={shelter.avatar} text={shelter.email} href={`/view_profile/${shelter.user_id}`} btn="View Profile" />
                        </div>
                    ))}
                </div>


            </div>
            <div className='centered-div'>
            <button className='login-btn director' onClick={handlePrev}>Previous</button>
            
                <button className='login-btn director' onClick={handleNext}>Next</button>
                </div>

        </div>
    );

}

export default Shelters;
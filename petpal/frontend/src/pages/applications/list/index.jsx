import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Form} from 'react-bootstrap';
import './style.css';

function to_url_params(object) {
    var result = [];
    for (const key in object) {
        if (Array.isArray(object[key])) {
            for (const value of object[key]) {
                result.push(`${key}[]=${value}`);
            }
        }
        else {
            let value = object[key];
            result.push(`${key}=${value}`);
        }
    }
    return result.join('&');
}

function ListApplications() {
    const offset_factor = 3;
    let navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const is_shelter = localStorage.getItem('is_shelter');
    const [ applications, setApplications ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)

    const query = useMemo(() => ({
        status : (searchParams.get("status") ?? ""),
        offset : parseInt(searchParams.get("offset") ?? 0),
        ordering : (searchParams.get("ordering") ?? ""),
    }), [searchParams]);

    // function get_profile() {
    //     fetch("http://127.0.0.1:8000/profile",  {
    //         method: "GET",
    //         headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
    //     })
    //     .then(request => request.json())
    //     .then(json => {
    //         localStorage.setItem('is_shelter', (json.is_shelter).toString())
    //         // setError(JSON.stringify(json))
    //         setProfile(json)
    //     })
        
    // };
  
    useEffect(() => {
        get_all_applications();
        // get_profile();
    }, [query]);

    const get_all_applications = async () => {
        const params = to_url_params(query);
        fetch(`http://127.0.0.1:8000/applications/?${params}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        })
        .then(response => response.json())
        .then(async json => {
            const applicationsWithListings = [];
            for (const application of json.results) {
                const listingResponse = await fetch(`http://localhost:8000/listings/${application.listing}/`, {
                    method: 'GET',
                });
                const listingData = await listingResponse.json();
                applicationsWithListings.push({ ...application, listingData });

            }
            setApplications(applicationsWithListings);
            // setApplications(json.results);
            setNext(json.next);
            setPrev(json.previous);
        });
 
    };


    const get_applications = (url) => {
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
        })
        .then(response => response.json())
        .then(async json => {
            const applicationsWithListings = [];
            for (const application of json.results) {
                const listingResponse = await fetch(`http://localhost:8000/listings/${application.listing}/`, {
                    method: 'GET',
                });
                const listingData = await listingResponse.json();
                applicationsWithListings.push({ ...application, listingData });

            }
            setApplications(applicationsWithListings);
            // setApplications(json.results);
            setNext(json.next);
            setPrev(json.previous);
        });
        
       
    };

    function handleNext() {
        if (next !== null) {
            // setSearchParams({ ...query, offset: query.offset + offset_factor });
            get_applications(next);
        }
    };

    function handlePrev() {
        if (prev !== null) {
            get_applications(prev);
        }
    };

    
    const handleViewDetails = (applicationID) => {
        navigate(`/application/${applicationID}`);
    };

    return (
        <div>
            <div className='centered-div'>
                <h4>List of Applications</h4>

            </div>
            <div className='centered-div mb'>
                    <select id="filter-application" name="sort" onChange={event => setSearchParams({...query, status: event.target.value, offset: 0})}>
                        <option value="">Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>
                    <select id="sort-application" name="sort" onChange={event => setSearchParams({...query, ordering: event.target.value, offset: 0})}>
                                <option value="">Order By</option>
                                <option value="-created_at">Creation Time</option>
                                <option value="-last_updated">Last Updated</option>
                    </select>
            </div>

            <div className='centered-div'>

                <div className='cards-container'>
                {applications.map(application => (
                        <div key={application.id} className='card text-center' style={{backgroundColor: '#8b5b51', color: 'white'}}>
                            <div className='card-body'>
                                {/* <h3 className="text-center">{application.first_name} {application.last_name}</h3> */}
                                <h3 className="text-center">
                                {is_shelter === "true" ? `${application.first_name} ${application.last_name}` : application.listingData?.name}
                                </h3>
                                <p className="card-text">Email : {application.email}</p>
                                    <p className="card-text">Status : {application.status}</p>
                                    <p className="card-text">Notes : {application.notes}</p>
                                    <p className="card-text">Created At : {application.created_at}</p>
                                    <p className="card-text">Last Updated At : {application.last_updated}</p>
                                    {localStorage.getItem('is_shelter') === "true" ? <p className="card-text">Pet : {application.listingData?.name}</p> : <></>}
                                    
                            
                                    <Button variant="solid" onClick={() => handleViewDetails(application.id)}>View Details</Button>
                            </div>
                        </div>

                
                    ))}
                </div>


            </div>
            <div className='centered-div'>
                    <button className='login-btn direct' onClick={handlePrev}>Previous</button>
                    <button className='login-btn direct' onClick={handleNext}>Next</button>
                </div>

        </div>
        
            // <div >
            //     <h2>List of Applications</h2>
                
                
            //     <div className='cards-container'>
             
            //         <select id="sort" name="sort" onChange={event => setSearchParams({...query, status: event.target.value, offset: 0})}>
            //             <option value="">Status</option>
            //             <option value="pending">Pending</option>
            //             <option value="accepted">Accepted</option>
            //             <option value="withdrawn">Withdrawn</option>
            //         </select>
            //         <div className='centered-div'>
                        
            //         {applications.map(application => (
            //             <div key={application.id} className='card text-center' style={{backgroundColor: '#8b5b51'}}>
            //                 <div className='card-body'>
            //                     <h3 className="text-center">{application.first_name} {application.last_name}</h3>
            //                     <p className="card-text">Email : {application.email}</p>
            //                         <p className="card-text">Status : {application.status}</p>
            //                         <p className="card-text">Notes : {application.notes}</p>
            //                         <p className="card-text">Created At : {application.created_at}</p>
            //                         <p className="card-text">Last Updated At : {application.last_updated}</p>
            //                         <p className="card-text">Pet : {application.listingData?.name}</p>
                            
            //                         <Button variant="solid" onClick={() => handleViewDetails(application.id)}>View Details</Button>
            //                 </div>
            //             </div>

                
            //         ))};
            //         </div>
            //      </div>

            //     <div className='centered-div'>
            //         <button className='login-btn direct' onClick={handlePrev}>Previous</button>
            //         <button className='login-btn direct' onClick={handleNext}>Next</button>
            //     </div>

               
            // </div>
       
    );
}

export default ListApplications;
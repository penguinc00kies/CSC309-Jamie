import { useState, useEffect, useMemo } from "react";
import { ajax } from '../../ajax';
import { useSearchParams } from "react-router-dom";
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

function ShelterView() {
    const offset_factor = 3;
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ listings, setListings ] = useState([]);
    const [ last1, setLast1 ] = useState([]);
    const [ last2, setLast2 ] = useState([]);
    const [ last3, setLast3 ] = useState([]);
    const [ search, setSearch ] = useState([]);
    // const [ query, setQuery ] = useState({search: "", breed: "", order: "", gender: "", vaccinated: "", neutered: "", offset: 0})
    const [ next, setNext ] = useState(null)
    const [ prev, setPrev ] = useState(null)
    const [ profile, setProfile ] = useState([])

    // function get_profile() {
    //     ajax("/profile",  {
    //         method: "GET",
    //         headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
    //     })
    //     .then(request => request.json())
    //     .then(json => {
    //         // setError(JSON.stringify(json))
    //         setProfile(json)
    //     })   
    // }
    
    const query = useMemo(() => ({
        breed : (searchParams.get("breed") ?? ""),
        order : (searchParams.get("order") ?? ""),
        gender : (searchParams.get("gender") ?? ""),
        vaccinated :(searchParams.get("vaccinated") ?? ""),
        neutered : (searchParams.get("neutered") ?? ""),
        offset : parseInt(searchParams.get("offset") ?? 0),
    }), [searchParams]);

    useEffect(() => {
        const get_profile = async () => {
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

        // const { search, breed, order, gender, vaccinated, neutered, offset} = query;
        const params = to_url_params(query);
        // fetch(`http://localhost:8000/listings/?search=${search}&gender=${gender}&breed=${breed}&on_hold=&neutered=${neutered}&vaccinated=${vaccinated}&ordering=${order}limit=3&offset=${offset}`)
        fetch(`http://localhost:8000/listings/?search=${search}&${params}`)
        .then(response => response.json())
        .then(json => {
            setListings(json.results);
            setNext(json.next);
            setPrev(json.previous);
        })

        get_profile();
    }, [query, search]);

    return <>
        <body className="search page">
                <main>
                    {/* <p>My id is: {profile.user_id}</p> */}
                    <h3 id="landingtitle">My Pets</h3>
                    <div className="center">
                    <a href={'/listings/creation'} className="btn btn-primary" id="lm">Create New Listing</a>
                    </div>
                    <div className="spacer"></div>
                    <div className="searchelements">
                        <div className="searchform">
                            <select id="filter" name="filter" onChange={event => setSearchParams({...query, order: event.target.value, offset: 0})}>
                                <option value="">Order By</option>
                                <option value="birthday">Birthday</option>
                                <option value="name">Name</option>
                            </select>
                            <input type="text" id="searchbar" name="searchbar" value={search} onChange={event => setSearch(event.target.value)}/>
                            <select id="sort" name="sort" onChange={event => setSearchParams({...query, breed: event.target.value, offset: 0})}>
                                <option value="">Species</option>
                                <option value="bunny">Bunny</option>
                                <option value="cat">Cat</option>
                                <option value="dog">Dog</option>
                            </select>
                            <select id="sort" name="sort" onChange={event => setSearchParams({...query, gender: event.target.value, offset: 0})}>
                                <option value="">Gender</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                            <select id="sort" name="sort" onChange={event => setSearchParams({...query, neutered: event.target.value, offset: 0})}>
                                <option value="">Neutered</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                            <select id="sort" name="sort" onChange={event => setSearchParams({...query, vaccinated: event.target.value, offset: 0})}>
                                <option value="">Vaccinated</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>
                    {/* <h3 className="searchmessage">Search results for: filter=""</h3> */}
                    <div className="searchresults">
                        {listings.map(listing => (
                            <>
                            { listing.shelter == profile.user_id  ? 
                            <div className="searchitem card">
                                
                                <div className="imgcontainer">
                                    <img className="card-img-top" src={listing.picture1} alt="Card image cap"/>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{listing.name}</h5>
                                    <p className="card-text">Breed : {listing.breed}</p>
                                    <p className="card-text">Gender : {listing.gender}</p>
                                    <p className="card-text">Birthday : {listing.birthday}</p>
                                    { listing.neutered == true ?
                                    <p className="card-text">Neutered : Yes</p>
                                    : <p className="card-text">Neutered : No</p>}
                                    { listing.vaccinated == true ?
                                    <p className="card-text">Vaccinated : Yes</p>
                                    : <p className="card-text">Vaccinated : No</p>}
                                    <a href={'/listings/update/' + listing.id} className="btn btn-primary" id="lm">Edit Listing</a>
                                </div>
                            </div>
                            :<></>
                                }
                            </>
                        ))}
                    </div>
                    <div className="pagination">
                        { next == null ?
                            <></>
                            : <button id="pbutton" onClick={() => setSearchParams({...query, offset: query.offset + offset_factor})}>Next</button>}
                        { prev == null ?
                            <></>
                            : <button id="pbutton" onClick={() => setSearchParams({...query, offset: query.offset - offset_factor})}>Previous</button>}
                    </div>
                </main>
            
        </body>
    </>;
}

export default ShelterView;
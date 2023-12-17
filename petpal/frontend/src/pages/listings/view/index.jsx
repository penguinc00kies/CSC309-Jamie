import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/profile.jpg'

function ListingView() {
    const { listingID } = useParams();
    const [ listing, setListing ] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/listings/${listingID}/`)
        .then(response => response.json())
        .then(json => {
            setListing(json);
        })
    }, []);

    return <>
        <div class="petdetail-container-here">


        <div id="carouselExample" class="carousel slide">
            <div class="carousel-inner">
                { listing.picture1 == null ? 
                <></>
                :<div class="carousel-item active">
                <img className="carousel-img" src={listing.picture1} alt="..."/>
                </div>}
                { listing.picture2 == null ? 
                <></>
                :<div class="carousel-item active">
                <img className="carousel-img" src={listing.picture2} alt="..."/>
                </div>}
                { listing.picture3 == null ? 
                <></>
                :<div class="carousel-item active">
                <img className="carousel-img" src={listing.picture3} alt="..."/>
                </div>}
                { listing.picture4 == null ? 
                <></>
                :<div class="carousel-item active">
                <img className="carousel-img" src={listing.picture4} alt="..."/>
                </div>}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>

        </div>

        <h1 class="petname">{listing.name}</h1>
        <div class="round-rect center petdetail">
            <form class="pet-update-form" action="pet_adoption.html">
                <div>
                    <label class="boldedlbl" for="petAge">Birthday: </label>
                    <label for="GIVENpetName"> {listing.birthday}</label>
                </div>

                <div>
                    <label class="boldedlbl" for="petAge">Breed: </label>
                    <label for="GIVENpetName"> {listing.breed}</label>
                </div>

                {/* <div>
                    <label class="boldedlbl" for="shelterLocation">Address:</label>
                    <label for="GIVENpetName"> 1120 Westchester Place </label>
                </div>

                <div>
                    <label class="boldedlbl" for="phone-number">Phone Number</label>
                    <label for="GIVENpetName"> (123)-456-7890</label>
                </div> */}

                <div>
                    <label class="boldedlbl" for="gender">Gender: </label>
                    <label for="GIVENpetName"> {listing.gender}</label>
                </div>

                <div>
                    <label class="boldedlbl" for="vaccination">Vaccinated: </label>
                    { listing.vaccinated == true ?
                    <label for="GIVENpetName"> Yes</label>
                    : <label for="GIVENpetName"> No</label>
                    }
                </div>

                <div>
                    <label class="boldedlbl" for="neutered">Neutered: </label>
                    { listing.neutered == true ?
                    <label for="GIVENpetName"> Yes</label>
                    : <label for="GIVENpetName"> No</label>
                    }
                </div>
                
                {/* <div>
                    <label class="boldedlbl" for="myfile">Medical Records:</label>
                </div> */}
                <div>
                    <label type="file" class = "attachmentlbl" id="medicalrecords" name="attachments" required> None</label>
                </div> 
                <div>
                    <label class="boldedlbl" for="petExplained">Description:</label>
                </div>
                <div>
                    <label type="file" class = "attachmentlbl" id="medicalrecords" name="attachments" required> {listing.description} </label>
                </div>
                <div class="button-container">
                    {/* <a class="petcreation-btn" href={'/listings/' + listing.id + '/applications/'}>
                        <input class="petcreation-btn" name="submit" type="submit" value="ADOPT"/>
                    </a> */}

                    <a class="petcreation-btn" href={'/listings/' + listing.id + '/applications/'}>
                        <input class="petcreation-btn" value="ADOPT"/>
                    </a>
                
                    <a class="petcreation-btn" href={'/listings/'}>
                        <input class="petcreation-btn" value="BACK"/>
                    </a>
                </div>
            </form>
        </div>

        </div>
    </>
}

export default ListingView;
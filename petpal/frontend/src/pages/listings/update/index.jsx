import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ajax } from '../../ajax';
import './style.css';
import Box from '../../../components/common/box'
import pfpHolder from '../../../assets/profile.jpg'

function ListingUpdate() {
    const { listingID } = useParams();
    const [ listing, setListing ] = useState([]);

    function handle_submit(event) {
        let data = new FormData(event.target);
        
        if (data.get("neutered") == 'trues') {
          data.set("neutered", true);
        }
        else {
          data.set("neutered", false);
        }
  
        if (data.get("vaccinated") == 'trues') {
          data.set("vaccinated", true);
        }
        else {
          data.set("vaccinated", false);
        }
  
        var object = {};
        data.forEach(function(value, key){
          object[key] = value;
        });
        var json = JSON.stringify(object);
        console.log(json);
  
  
        fetch(`http://localhost:8000/listings/update/${listingID}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          },
          body: json, 
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log(response.json);
            return response.json();
          })
          .then((data) => {
            console.log('Form submitted successfully:', data);
            return alert("Listing Updated Successfully")
          })
          .catch((error) => {
            console.error('Error submitting form:', error);
          });
          event.preventDefault();
      }


    useEffect(() => {
        fetch(`http://localhost:8000/listings/${listingID}/`)
        .then(response => response.json())
        .then(json => {
            setListing(json);
        })
    }, []);


    return <>
    <div class="round-rect center form-petcreation">
            <h2 class="page-title">Pet Update</h2>
            <form class="pet-creation-form" onSubmit={handle_submit}>
                <div>
                    <label for="petName">Pet Name:</label>
                    <input class="input-petName" name="name" id="name" type="text" value={listing.name} required/>
                </div>

                <div>
                    <label for="petAge">Pet Age:</label>
                    <input class="input-petAge" name="birthday" id="birthday" type="date" value={listing.birthday} required/>
                </div>

                <div class="addspacelbl">
                    <label for="petAge">Pet Breed:</label>
                    <select id="breed" name="breed">
                        {/* <option value="" disabled selected></option>
                        <option value="cat">Cat</option>
                        <option value="dog">Dog</option>
                        <option value="bunny">Bunny</option> */}
                        { listing.breed == "cat" ? 
                        <>
                        <option value="cat" selected>Cat</option>
                        <option value="dog">Dog</option>
                        <option value="bunny">Bunny</option> 
                        </>
                        : <></>}
                        { listing.breed == "dog" ? 
                        <>
                        <option value="cat">Cat</option>
                        <option value="dog" selected>Dog</option>
                        <option value="bunny">Bunny</option> 
                        </>
                        : <></>}
                        { listing.breed == "bunny" ? 
                        <>
                        <option value="cat">Cat</option>
                        <option value="dog">Dog</option>
                        <option value="bunny" selected>Bunny</option> 
                        </>
                        : <></>}
                    </select>
                </div>

                {/* <div>
                    <label for="shelterLocation">Address:</label>
                    <input class="input-shelterLocation" name="shelterLocation" id="shelterLocation" type="text" required/>
                </div> */}

                {/* <div>
                    <label for="phone-number">Phone Number</label>
                    <input class="input-phone-number" name="phone-number" id="phone-number" type="text" placeholder="e.g (123)-456-7890" required/>
                </div> */}

                <div>
                    <label for="petExplained">Pet Description:</label>
                </div>
                <textarea class="input-petExplained" name="description" id="description" rows="4" placeholder="Enter description here" value={listing.description} required></textarea>

                { listing.gender == "male" ? 
                <>
                <div id="wrapper">
                    <label class = "gender" for="male_female_radio">Pet's gender:</label>
                  <p>
                    <label> Female
                        <input type="radio" name="gender"  id='female' value='female' required/>
                    </label>
                  </p>
                  <p>
                    <label> Male
                        <input type="radio" name="gender" id='male' value='male' checked/>
                    </label>
                  </p>
                </div>
                </>
                : <>
                <div id="wrapper">
                    <label class = "gender" for="male_female_radio">Pet's gender:</label>
                  <p>
                    <label> Female
                        <input type="radio" name="gender"  id='female' value='female' checked required/>
                    </label>
                  </p>
                  <p>
                    <label> Male
                        <input type="radio" name="gender" id='male' value='male' checked/>
                    </label>
                  </p>
                </div>
                </>
                }

                { listing.vaccinated == true ?
                <div id="wrapper">
                    <label for="yes_no_radio">Is the pet vaccinated?</label>
                  <p>
                    <label> Yes
                        <input type="radio" name="vaccinated" id='yesclickedneedle' value='true' checked required/>
                    </label>
                  </p>
                  <p>
                    <label> No
                        <input type="radio" name="vaccinated"  id='noclickedneedle' value='false'/>
                    </label>
                    
                  </p>
                </div>
                :<div id="wrapper">
                    <label for="yes_no_radio">Is the pet vaccinated?</label>
                <p>
                    <label> Yes
                        <input type="radio" name="vaccinated" id='yesclickedneedle' value='true' required/>
                    </label>
                </p>
                <p>
                    <label> No
                        <input type="radio" name="vaccinated"  id='noclickedneedle' value='false' checked/>
                    </label>
                    
                </p>
                </div>
                }

                { listing.neutered == true ?
                <div id="wrapper">
                    <label class = "neutered" for="yes_no_radio">Is the pet neutered?</label>
                <p>
                    <label> Yes
                        <input type="radio" name="neutered" id='yesclicked' value='true' checked required/>
                    </label>
                </p>
                <p>
                    <label> No
                        <input type="radio" name="neutered" id='noclicked' value='false' />
                    </label>
                </p>
                </div>
                :<div id="wrapper">
                    <label class = "neutered" for="yes_no_radio">Is the pet neutered?</label>
                <p>
                    <label> Yes
                        <input type="radio" name="neutered" id='yesclicked' value='true' required/>
                    </label>
                </p>
                <p>
                    <label> No
                        <input type="radio" name="neutered" id='noclicked' value='false' checked />
                    </label>
                </p>
                </div>}

                {/* <div>
                    <label for="myfile">Photos of Pet (4 max):</label>
                </div>
                  <input type="file" class = "attachmentlbl" id="petpic1" name="attachment1" required/>
                  <input type="file" class = "attachmentlbl" id="petpic2" name="attachment2"/>
                  <input type="file" class = "attachmentlbl" id="petpic3" name="attachment3"/>
                  <input type="file" class = "attachmentlbl" id="petpic4" name="attachment4"/> */}

                  <div class="button-container">
                    <input class="petcreation-btn" name="submit" type="submit" value="UPDATE"/>
                    <input class="petcreation-btn" name="reset" type="reset" value="RESET"/>
                </div>
            </form>
        </div>
    </>
}

export default ListingUpdate;
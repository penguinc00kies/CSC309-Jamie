import { redirect, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ajax } from '../../ajax';
import './style.css';

function Creation() {
  let navigate = useNavigate();

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

      fetch("http://localhost:8000/listings/creation/", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
        body: data, 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log(response.json);
          return response.json();
        })
        .then((data) => {
          // console.log('Form submitted successfully:', data);
          alert("Listing Created Successfully")
          navigate('/listings');
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
        });
        event.preventDefault();
    }


    return <>
    <div class="round-rect center form-petcreation two">
            <h2 class="page-title">Pet Creation</h2>
            <form class="pet-creation-form" onSubmit={handle_submit} enctype='multipart/form-data'>
                <div>
                    <label for="petName">Pet Name:</label>
                    <input class="input-petName" name="name" id="name" type="text" required/>
                </div>

                <div>
                    <label for="petAge">Pet Birthday:</label>
                    <input class="input-petAge" name="birthday" id="birthday" type="date" required/>
                </div>

                <div class="addspacelbl">
                    <label for="petAge">Pet Breed:</label>
                    <select id="breed" name="breed">
                        <option value="" disabled selected></option>
                        <option value="cat">Cat</option>
                        <option value="dog">Dog</option>
                        <option value="bunny">Bunny</option>
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
                <textarea class="input-petExplained" name="description" id="description" rows="4" placeholder="Enter description here" required></textarea>

                <div id="wrapper">
                    <label class = "gender" for="male_female_radio">Pet's gender:</label>
                  <p>
                    <label> Female
                        <input type="radio" name="gender"  id='female' value='female' required/>
                    </label>
                  </p>
                  <p>
                    <label> Male
                        <input type="radio" name="gender" id='male' value='male'/>
                    </label>
                  </p>
                </div>

                <div id="wrapper">
                    <label for="yes_no_radio">Is the pet vaccinated?</label>
                  <p>
                    <label> Yes
                        <input type="radio" name="vaccinated" id='yesclickedneedle' value='trues' required/>
                    </label>
                  </p>
                  <p>
                    <label> No
                        <input type="radio" name="vaccinated"  id='noclickedneedle' value='falses'/>
                    </label>
                    
                  </p>
                </div>

                <div id="wrapper">
                    <label class = "neutered" for="yes_no_radio">Is the pet neutered?</label>
                  <p>
                    <label> Yes
                        <input type="radio" name="neutered" id='yesclicked' value='trues' required/>
                    </label>
                  </p>
                  <p>
                    <label> No
                        <input type="radio" name="neutered" id='noclicked' value='falses' />
                    </label>
                  </p>
                </div>

                <div>
                    <label for="myfile">Photos of Pet (4 max):</label>
                </div>
                  <input type="file" class = "attachmentlbl" id="petpic1" name="picture1" required/>
                  <input type="file" class = "attachmentlbl" id="petpic2" name="picture2"/>
                  <input type="file" class = "attachmentlbl" id="petpic3" name="picture3"/>
                  <input type="file" class = "attachmentlbl" id="petpic4" name="picture4"/>

                  <div class="button-container">
                    <input class="petcreation-btn" name="submit" type="submit" value="SUBMIT"/>
                    <input class="petcreation-btn" name="reset" type="reset" value="RESET"/>
                </div>
            </form>
        </div>
    </>
}

export default Creation;
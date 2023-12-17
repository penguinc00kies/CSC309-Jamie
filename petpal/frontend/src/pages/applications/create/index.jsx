import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './style.css';

function CreateApplication() {
    const { listingID } = useParams();
    const [profile, setProfile] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });

    function get_profile() {
      fetch("http://127.0.0.1:8000/profile",  {
          method: "GET",
          headers: {"Authorization": `Bearer ${localStorage.getItem('access')}`}
      })
      .then(request => request.json())
      .then(json => {
          localStorage.setItem('is_shelter', (json.is_shelter).toString())
          // setError(JSON.stringify(json))
          setProfile(json)
          setFormData({ ...formData, email: json.email, phone: json.phone, address: json.address});
      })
      
  };

  useEffect(() => {
    get_profile();
}, []);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        // const token = localStorage.getItem('access');
        // console.log(token)
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyMDczNTY0LCJpYXQiOjE3MDE5ODcxNjQsImp0aSI6IjU4MzM3ZWFjMTNlYTRiNDQ4ZWIwOGE2YmQyZDViNDNjIiwidXNlcl9pZCI6MX0.riyrfZnBSyCZDl_zydtgbVFN8BrLnqIhBuFHsVpvanQ';
    
        const API_URL = `http://127.0.0.1:8000/listings/${listingID}/applications/`;
        
        console.log(formData);
        fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access')}`,
            },
            body: JSON.stringify(formData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              console.log('Form submitted successfully:', data);
              navigate('/listings');
            })
            .catch((error) => {
              console.error('Error submitting form:', error);
            });
            e.preventDefault();
    };

    const handle_reset = () => {
      setFormData({
        first_name: '',
        last_name: '',
        notes: '',
      });
    };

    return (
        <div className="page-container">
      <div className="round-rect center form pet-adoption">
        <h2 className="adoption-page-title">Pet Adoption</h2>
        <form className="pet-application-form" onSubmit={handleSubmit}>
          <div>
            <label className="firstname" htmlFor="firstname">
              First Name
            </label>
            <input
              className="input-firstname"
              name="first_name"
              id="firstname"
              type="text"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
          </div>

          <div>
            <label className="lastname" htmlFor="lastname">
              Last Name
            </label>
            <input
              className="input-lastname"
              name="last_name"
              id="lastname"
              type="text"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </div>

          <div>
            <label className="label-phone-number" htmlFor="phone-number">
              Phone Number
            </label>
            <input
              className="input-phone-number"
              name="phoneNumber"
              id="phone-number"
              type="text"
              placeholder="e.g. (123)-456-7890"
              onChange={handleChange}
              defaultValue={profile.phone}
              required
            />
          </div>

          <div>
            <label className="label-email" htmlFor="email">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              readOnly
            />
          </div>

          <div>
            <label className="label-address" htmlFor="address">
              Your Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              defaultValue={profile.address}
              required
            />
          </div>

          <div>
            <label className="label-notes" htmlFor="notes">
              Additional Notes:
            </label>
          </div>

          <textarea
            className="input-notes"
            rows="4"
            id="notes"
            name="notes"
            placeholder="Add additional notes here"
            onChange={handleChange}
            value={formData.notes}
          ></textarea>

          <div className="pet-adoption-button-container">
            <input className="login-btn" name="submit" type="submit" value="Submit" />
            <input className="login-btn" type="reset" value="Reset" onClick={handle_reset}/>
          </div>
        </form>
      </div>
    </div>
  

    );
};
export default CreateApplication;
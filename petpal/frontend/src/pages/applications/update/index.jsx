import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ajax } from "../../ajax";
import './style.css';

function ApplicationUpdate() {
  const { applicationID } = useParams();
  const [application, setApplication] = useState([]);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState([])
  const navigate = useNavigate();

  function handle_submit(event) {
    let data = new FormData(event.target);

    if (data.get("status") === 'withdrawn') {
      data.set("status", "withdrawn");
    }
    console.log("Status:", data.get("status"));

    if (data.get("status") === 'accepted') {
      data.set("status", "accepted");
    }
    if (data.get("status") === 'denied') {
      data.set("status", "denied");
    }

    var object = {};
    data.forEach(function (value, key) {
      object[key] = value;
    });
    var json = JSON.stringify(object);
    console.log(json);

    fetch(`http://127.0.0.1:8000/applications/${applicationID}/update/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
      },
      body: json,
    })
      .then((response) => {
        return response.json();
      })
      .then((err) => {
        if ('detail' in err) {
          setError(err.detail);
        } else {
          navigate(`/application/${applicationID}`);
        }
      })

    console.log(localStorage.getItem('access'));

    event.preventDefault();

  }

  function get_application() {
    fetch(`http://127.0.0.1:8000/applications/${applicationID}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log('Response JSON:', json);
        setApplication(json);
      });
  }

  useEffect(() => {
    // const get_profile = async () => {

    //   try {
    //     const user_info = await ajax("/profile", {
    //       method: "GET",
    //       headers: { "Authorization": `Bearer ${localStorage.getItem('access')}` }
    //     });
    //     const json = await user_info.json();

    //     // setError(JSON.stringify(json))
    //     setProfile(json)
    //   } catch (error) {
    //     localStorage.setItem('is_shelter', 'false');
    //   }


    // }

    // get_profile();
    get_application();
  }, [applicationID]);



  return (
    <div className="page-container">
      <div className="round-rect center form pet-adoption">
        <h2 className="adoption-page-title">Pet Adoption</h2>
        <form className="pet-application-form" onSubmit={handle_submit}>
          <div>
            <label className="firstname" htmlFor="firstname">
              First Name
            </label>
            <input
              className="input-firstname"
              name="first_name"
              id="firstname"
              type="text"
              defaultValue={application['first_name']}
              readOnly
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
              defaultValue={application['last_name']}
              readOnly
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
              defaultValue={application['phone']}
              readOnly
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
              defaultValue={application['email']}
              readOnly
            />
          </div>
          <div>
            <label className="label-status" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              name="status"
              defaultValue={application['status']}
            >
              {localStorage.getItem('is_shelter') === "true" ? <> <option value=""> </option> <option value="accepted">Accepted</option>
                <option value="denied">Denied</option> </> : <><option value=""> </option><option value="withdrawn">Withdrawn</option></>}
            </select>
          </div>
          <p className="error">{error}</p>

          <div>
            <label className="label-address" htmlFor="address">
              Your Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={application['address']}
              readOnly
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
            defaultValue={application['notes']}
            readOnly
          ></textarea>

          <div className="pet-adoption-button-container">
            <input className="login-btn" name="submit" type="submit" value="Submit" />
            <input className="login-btn" type="reset" value="Reset" />
          </div>
        </form>
      </div>
    </div>


  );
};
export default ApplicationUpdate;
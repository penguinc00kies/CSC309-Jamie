import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ModalPage from '../../comments/chatbox';

import './style.css';

function Application() {

    let navigate = useNavigate();
    const [ application, setApplication ] = useState({});
    const { applicationID } = useParams();

    useEffect(() => {
        // const token = localStorage.getItem('access');
        // console.log(token)
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyMDczNTY0LCJpYXQiOjE3MDE5ODcxNjQsImp0aSI6IjU4MzM3ZWFjMTNlYTRiNDQ4ZWIwOGE2YmQyZDViNDNjIiwidXNlcl9pZCI6MX0.riyrfZnBSyCZDl_zydtgbVFN8BrLnqIhBuFHsVpvanQ';
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
    }, [ applicationID ]);

    const handleEdit = (applicationID) => {
        navigate(`/application/${applicationID}/update`);
    };

    const handleChat = (applicationID) => {
        navigate(`/application/${applicationID}/chat/box`);
        console.log('Modal opened!');
        setIsChatModalOpen(true);
    };


    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    // const openModal = () => {
    //     console.log('Modal opened!');
    //     setIsChatModalOpen(true);
    // };


    return (
        <div className="centered-div">
        <div className="round-rect center form-pet-application">
            <h2 className="application-page-title">Pet Application Details</h2>
            
            <form className="pet-application-form">
            <div>
                <label className="firstname" htmlFor="firstname">
                First Name
                </label>
                <input
                className="input-firstname"
                name="firstname"
                id="firstname"
                type="text"
                value={application.first_name || ""}
                readOnly
                />
            </div>

            <div>
                <label className="lastname" htmlFor="lastname">
                Last Name
                </label>
                <input
                className="input-lastname"
                name="lastname"
                id="lastname"
                type="text"
                value={application.last_name || ""}
                readOnly
                />
            </div>

            <div>
                <label className="label-phone-number" htmlFor="phone-number">
                Phone Number
                </label>
                <input
                className="input-phone-number"
                name="phone-number"
                id="phone-number"
                type="text"
                value={application.phone || ""}
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
                value={application.email || ""}
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
                value={application.address || ""}
                readOnly
                />
            </div>

            <div>
                <label className="label-status" htmlFor="status">
                Status:
                </label>
                <input
                type="text"
                id="status"
                name="status"
                value={application.status || ""}
                
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
                value={application.notes || ""}
                readOnly
            ></textarea>

        <div className="pet-adoption-button-container centered-div">
            <input className="login-btn" onClick={() => handleEdit(application.id)} name="edit" type="submit" value="Edit" />
            {application.status !== 'withdrawn' ? <input className="login-btn" onClick={() => handleChat(application.id)} name="chat" type="submit" value="Chat" /> : <></>}
    
            
          </div>

           
            {/* <Link to={`/application/${applicationID}/chat/box`} className="login-btn" onClick={openModal}>
                Chat
            </Link> */}

            <div>

            {isChatModalOpen && (
                <div className="modal-overlay">
                <ModalPage onClose={() => setIsChatModalOpen(false)} />
                </div>
            )}
            </div>
            </form>

        </div>


    </div>
   
    );

}

export default Application;
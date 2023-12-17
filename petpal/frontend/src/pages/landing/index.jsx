import './style.css'
import tempLogo from '../../assets/temp-logo.webp';
import ButtonLink from '../../components/common/button-link';
import Box from '../../components/common/box'
import React from 'react';
import {useNavigate} from 'react-router-dom';


function Landing() {
    return( 
    <>
        <div className='landing'>

            <Box type="round-rect landing">
                <img className="large-logo" src={tempLogo} />
                <ButtonLink href="/login" text="LOGIN"/>
                <ButtonLink href="/signup" text="SIGNUP"/>
            </Box>

            </div>

    </>)
}

export default Landing;
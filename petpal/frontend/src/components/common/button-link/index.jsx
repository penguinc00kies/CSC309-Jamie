import './style.css'
import {useNavigate} from 'react-router-dom';
import {Link, useParams} from 'react-router-dom';

function ButtonLink({href, text}) {
    let navigate = useNavigate();
    return(
        <>
            <Link class="btn-link" to={href}>
                {text}
            </Link>
        </>
    )
}

export default ButtonLink;
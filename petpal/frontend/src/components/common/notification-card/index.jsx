import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import placeholder from '../../../assets/placeholder.jpeg'
import './style.css'

function NotificationCard({key, title, src, text, read, view, del, link}) {
    const image = src || placeholder
    return (
      <Card key={key} style={{ width: '18rem' }}>
        {/* <Card.Img variant="top" src={image} alt="Card Image" /> */}
        <Card.Body>
            
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {text}
          </Card.Text>
          <h5>
            {read}
          </h5>
          <Button variant="secondary" href={link} onClick={view}>View</Button>
          <Button variant="secondary" onClick={del}>Delete</Button>
        </Card.Body>
      </Card>
    );
  }
  
  export default NotificationCard;
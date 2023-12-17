import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import placeholder from '../../../assets/placeholder.jpeg'
import './style.css'

function DisplayCard({key, title, src, text, btn, href}) {
    const image = src || placeholder
    return (
      <Card key={key} style={{ width: '18rem' }}>
        <Card.Img variant="top" src={image} alt="Card Image" />
        <Card.Body className='shelter'>
            
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {text}
          </Card.Text>
          <Button variant="secondary" href={href}>{btn}</Button>
        </Card.Body>
      </Card>
    );
  }
  
  export default DisplayCard;
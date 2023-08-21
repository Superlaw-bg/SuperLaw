import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

import './Header.scss';

const Header = () => {
    return(
        <Navbar className='nav d-flex justify-content-between'>
            <div className='left'>
                <Navbar.Brand as={Link} to="/" className='logo'>SuperLaw</Navbar.Brand>
            </div>
            <div className='right'>
            <Nav.Item>
                <Nav.Link as={Link} className="login nav-link" to="/login">Вход</Nav.Link>
            </Nav.Item>
            </div>
        </Navbar>
    );
  };
  
  export default Header;
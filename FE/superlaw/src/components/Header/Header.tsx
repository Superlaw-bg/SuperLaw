import { Link, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';

import './Header.scss';
import { useStoreActions, useStoreState } from '../../store/hooks';
import User from '../../store/auth/models/User';
import toastService from '../../services/toastService';
import { Lawyer } from '../../constants/roles';

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, email, role } = useStoreState(store => store.auth.user);
    const dispatchLogout = useStoreActions(actions => actions.auth.logout);

    const logout = () => {
        const user: User = {
            isLoggedIn: false,
            role: '',
            token: '',
            id: '',
            email: ''
        };

        dispatchLogout(user);
        toastService.showSuccess('Успешно излязохте от акаунта си');
        navigate('/');
    };

    const navigateToProfile = () => {
        if (role === Lawyer) {
            navigate('/profile');
        } else {
            navigate('/');
        }
    };

    const navigateToMeetings = () => {
        navigate('/my-meetings');
    };

    return(
        <Navbar className='superlaw-nav nav d-flex justify-content-between'>
            <div className='left'>
                <Navbar.Brand as={Link} to="/" className='logo'>Superlaw</Navbar.Brand>
            </div>
            <input type="checkbox" name="toggle" id="toggle" className="nav-toggle"/>
            <div className='right'>
                {isLoggedIn &&
                    <div className='nav-items'>
                        <label htmlFor="toggle">
                            <span className="close">X Затвори </span><span className ="open">Меню</span>
                        </label>
                        <Nav.Item as="li">
                            <Nav.Link onClick={navigateToProfile}>{email}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link onClick={navigateToMeetings}>Моите консултации</Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link onClick={logout}>Изход</Nav.Link>
                        </Nav.Item>
                    </div>
                }

                {!isLoggedIn &&
                    <Nav.Item>
                        <Nav.Link as={Link} className="login nav-link" to="/login">Вход</Nav.Link>
                    </Nav.Item> 
                }
            </div>
        </Navbar>
    );
  };
  
  export default Header;
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

    return(
        <Navbar className='nav d-flex justify-content-between'>
            <div className='left'>
                <Navbar.Brand as={Link} to="/" className='logo'>Superlaw</Navbar.Brand>
            </div>
            <div className='right'>
                {isLoggedIn &&
                    <div>
                        <a className='email' onClick={navigateToProfile}>{email}</a>
                        <Nav.Item>
                            <Nav.Link className="logout nav-link" onClick={logout}>Изход</Nav.Link>
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
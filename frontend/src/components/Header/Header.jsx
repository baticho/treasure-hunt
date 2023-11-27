import { Link } from 'react-router-dom';

import styles from './Header.module.css'

import { useAuthContext } from '../../contexts/AuthContext';

const Header = () => {
    const { auth } = useAuthContext();

    return (
        <header>
            <h1>
                <Link className={styles["home"]} to="/">
                    Treasure Hunts
                </Link>
            </h1>
            <nav>
                {auth && auth.user && <span>{auth.user.user}</span>}
                <Link to="/catalog">All treasure hunts</Link>
                {auth && auth.user 
                    ? <div id="user" className={styles["user-section"]}>
                        <Link to="/create">Create Treasure Hunt</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
                    : <div id="guest" className={styles["user-section"]}>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                }
            </nav>
        </header>
    );
};

export default Header;
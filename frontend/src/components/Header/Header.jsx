import { Link } from 'react-router-dom';

import styles from './Header.module.css'

import { useAuthContext } from '../../contexts/AuthContext';

const Header = () => {
    const { auth } = useAuthContext();
    const isGameStarted = auth?.user?.is_game_started;


    return (
        <header>
            <h1>
                <Link className={styles["home"]} to="/">
                    Treasure Hunts
                </Link>
            </h1>
            <nav>
                {auth && auth.user && <span>{auth.user.user}</span>}
                {isGameStarted ? (
                    <div id="user" className={styles["user-section"]}>
                    <Link to="/game">Continue Game</Link>
                    <Link to="/logout">Logout</Link>
                    </div>
                ) : (
                    <div id="guest" className={styles["user-section"]}>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
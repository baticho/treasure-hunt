import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from './Login.module.css'

import { AuthContext } from "../../contexts/AuthContext";
import * as authService from "../../services/authService";

const Login = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const {
            username,
            password,
        } = Object.fromEntries(new FormData(e.target));

        authService.login(username, password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch(() => {
                navigate('/NotFound');
            });
    };

    return (
        <section id="login-page" className={styles["login-page"]}>
            <form id="login" onSubmit={onSubmit}>
                <div className={styles["container"]}>
                    <h1 className={styles["form-header"]}>Login</h1>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        name="username"
                        placeholder="username"
                        className={styles["input"]}
                    />
                    <label htmlFor="login-pass">Password:</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        name="password" 
                        className={styles["input"]}
                    />
                    <input type="submit" className={`${styles["btn"]} ${styles["submit"]}`} value="Login" />
                    <p className={styles["field"]}>
                        <span className={styles["no-profile"]}>
                            Don't have a profile?  <Link to={'/register'}>Register</Link>
                        </span>
                    </p>
                </div>
            </form>
        </section>
    );
}

export default Login;
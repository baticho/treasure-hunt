import { Link, useNavigate } from 'react-router-dom';

import styles from './Register.module.css'

import * as authService from "../../services/authService";
import { withAuth } from "../../contexts/AuthContext";


const Register = ({ auth }) => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const username = formData.get('username');
        const email = formData.get('email');
        const firstName = formData.get('first_name');
        const lastName = formData.get('last_name');
        const password = formData.get('password');
        const confirmPassword = formData.get('password2');

        if (password !== confirmPassword) {
            return;
        }

        authService.register(username, email, firstName, lastName, password, confirmPassword)
            .then(authData => {
                auth.userLogin(authData);
                navigate('/');
            });
    }

    return (
        <section id="register-page" className={styles["register-page"]}>
            <form id="register" onSubmit={onSubmit}>
                <div className={styles["container"]}>
                    <h1 className={styles["form-header"]}>Register</h1>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        name="username"
                        placeholder="username"
                        className={styles["input"]}
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@email.com"
                        className={styles["input"]}
                    />
                    <label htmlFor="email">First name:</label>
                    <input
                        type="name"
                        id="first-name"
                        name="first_name"
                        placeholder="John"
                        className={styles["input"]}
                    />
                    <label htmlFor="email">Last Name:</label>
                    <input
                        type="name"
                        id="last-name"
                        name="last_name"
                        placeholder="Doe"
                        className={styles["input"]}
                    />
                    <label htmlFor="pass">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="register-password" 
                        className={styles["input"]}
                    />
                    <label htmlFor="con-pass">Confirm Password:</label>
                    <input 
                        type="password" 
                        name="password2" 
                        id="confirm-password" 
                        className={styles["input"]}
                    />
                    <input className={`${styles["btn"]} ${styles["submit"]}`} type="submit" defaultValue="Register" />
                    <p className={styles["field"]}>
                        <span className={styles["no-profile"]}>
                            You have a profile?  <Link to={'/login'}>Login</Link>
                        </span>
                    </p>
                </div>
            </form>
        </section>
    );
};

const RegisterWithAuth = withAuth(Register);

export default RegisterWithAuth;
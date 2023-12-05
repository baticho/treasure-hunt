import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from './Login.module.css'

import { AuthContext } from "../../contexts/AuthContext";
import * as authService from "../../services/authService";
import useForm from "../../hooks/useForm";

const Login = () => {
    const { userLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const { formValues, errors, handleChange, setErrors } = useForm({
        username: '',
        password: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();

        authService.login(formValues.username, formValues.password)
            .then(authData => {
                userLogin(authData);
                navigate('/');
            })
            .catch((error) => {
                const errorString = error.toString().replace('Error: ', '');
                const errors = JSON.parse(errorString);
                setErrors(errors);
            });
    };

    return (
        <section id="login-page" className={styles["login-page"]}>
            <form id="login" onSubmit={onSubmit}>
                <div className={styles["container"]}>
                    <h1 className={styles["form-header"]}>Login</h1>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        className={`${styles['input']} ${errors.detail ? 'error' : ''}`}
                        value={formValues.username}
                        onChange={handleChange}
                    />
                    <label htmlFor="login-pass">Password:</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        name="password" 
                        className={`${styles['input']} ${errors.detail ? 'error' : ''}`}
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    {errors.username && <span className={styles["field-error"]}>{errors.password}</span>}
                    <input type="submit" className={`${styles["btn"]} ${styles["submit"]}`} value="Login" />
                    {errors.detail && <span className="field-error">{errors.detail}</span>}
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

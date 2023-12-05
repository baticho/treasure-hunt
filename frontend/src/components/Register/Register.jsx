import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import styles from './Register.module.css';

import * as authService from '../../services/authService';
import { withAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';

const Register = ({ auth }) => {
    const navigate = useNavigate();

    const { formValues, errors, handleChange, setErrors } = useForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();

        let hasErrors = false;

        if (formValues.password !== formValues.password2) {
            setErrors({
                password2: 'Passwords do not match',
            });
            return;
        }

        authService
            .register(
                formValues.username,
                formValues.email,
                formValues.first_name,
                formValues.last_name,
                formValues.password,
                formValues.password2
            )
            .then((authData) => {
                auth.userLogin(authData);
                navigate('/');
            
            })
            .catch((error) => {
                const errorString = error.toString().replace('Error: ', '');
                const errors = JSON.parse(errorString);
                setErrors(errors);
            });
    };

    return (
        <section id="register-page" className={styles['register-page']}>
            <form id="register" onSubmit={onSubmit}>
                <div className={styles['container']}>
                    <h1 className={styles['form-header']}>Register</h1>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        className={`${styles['input']} ${errors.username ? styles['error'] : ''}`}
                        value={formValues.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className={styles["field-error"]}>{errors.username}</span>}
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@email.com"
                        className={`${styles['input']} ${errors.email ? styles['error'] : ''}`}
                        value={formValues.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className={styles["field-error"]}>{errors.email}</span>}
                    <label htmlFor="first-name">First name:</label>
                    <input
                        type="text"
                        id="first-name"
                        name="first_name"
                        placeholder="John"
                        className={`${styles['input']} ${errors.first_name ? styles['error'] : ''}`}
                        value={formValues.first_name}
                        onChange={handleChange}
                    />
                    {errors.first_name && <span className={styles["field-error"]}>{errors.first_name}</span>}
                    <label htmlFor="last-name">Last Name:</label>
                    <input
                        type="text"
                        id="last-name"
                        name="last_name"
                        placeholder="Doe"
                        className={`${styles['input']} ${errors.last_name ? styles['error'] : ''}`}
                        value={formValues.last_name}
                        onChange={handleChange}
                    />
                    {errors.last_name && <span className={styles["field-error"]}>{errors.last_name}</span>}
                    <label htmlFor="register-password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="register-password"
                        className={`${styles['input']} ${errors.password ? styles['error'] : ''}`}
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className={styles["field-error"]}>{errors.password}</span>}
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        name="password2"
                        id="confirm-password"
                        className={`${styles['input']} ${errors.password2 ? styles['error'] : ''}`}
                        value={formValues.password2}
                        onChange={handleChange}
                    />
                    {errors.password2 && <span className={styles["field-error"]}>{errors.password2}</span>}
                    <input className={`${styles['btn']} ${styles['submit']}`} type="submit" defaultValue="Register" />
                    <p className={styles['field']}>
                        <span className={styles['no-profile']}>
                            You have a profile? <Link to={'/login'}>Login</Link>
                        </span>
                    </p>
                </div>
            </form>
        </section>
    );
};

const RegisterWithAuth = withAuth(Register);

export default RegisterWithAuth;

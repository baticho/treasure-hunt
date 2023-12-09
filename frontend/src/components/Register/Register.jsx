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

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (formValues.password !== formValues.password2) {
            setErrors({
                password2: 'Passwords do not match',
            });
            return;
        }

        if (!validatePassword(formValues.password)) {
            setErrors({
                password: 'Password should be at least 8 characters long and contain letters and numbers',
            });
            return;
        }
        const { username, email, first_name, last_name, password, password2 } = formValues;
        authService
            .register(username, email, first_name, last_name, password, password2)
            .then(() => {
                authService.login(username, password)
                    .then((authData) => {
                        auth.userLogin(authData);
                        navigate('/');
                    })
                    .catch((loginError) => {
                        console.error('Login after registration failed:', loginError);
                    });
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
                        className={`${styles['input']} ${errors.username ? 'error' : ''}`}
                        value={formValues.username}
                        onChange={handleChange}
                    />
                    {errors.username && <span className="field-error">{errors.username}</span>}
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@email.com"
                        className={`${styles['input']} ${errors.email ? 'error' : ''}`}
                        value={formValues.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="field-error" >{errors.email}</span>}
                    <label htmlFor="first-name">First name:</label>
                    <input
                        type="text"
                        id="first-name"
                        name="first_name"
                        placeholder="John"
                        className={`${styles['input']} ${errors.first_name ? 'error' : ''}`}
                        value={formValues.first_name}
                        onChange={handleChange}
                    />
                    {errors.first_name && <span className="field-error">{errors.first_name}</span>}
                    <label htmlFor="last-name">Last Name:</label>
                    <input
                        type="text"
                        id="last-name"
                        name="last_name"
                        placeholder="Doe"
                        className={`${styles['input']} ${errors.last_name ? 'error' : ''}`}
                        value={formValues.last_name}
                        onChange={handleChange}
                    />
                    {errors.last_name && <span className="field-error">{errors.last_name}</span>}
                    <label htmlFor="register-password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="register-password"
                        className={`${styles['input']} ${errors.password ? 'error' : ''}`}
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    {errors.password && <span className="field-error">{errors.password}</span>}
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        name="password2"
                        id="confirm-password"
                        className={`${styles['input']} ${errors.password2 ? 'error' : ''}`}
                        value={formValues.password2}
                        onChange={handleChange}
                    />
                    {errors.password2 && <span className="field-error">{errors.password2}</span>}
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

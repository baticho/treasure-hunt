import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';

const Logout = () => {
    const navigate = useNavigate();
    const { auth, userLogout } = useContext(AuthContext);

    useEffect(() => {
        authService.logout(auth.refresh)
            .then(() => {
                userLogout();
                navigate('/');
            })
            .catch(() => {
                navigate('/');
            });
    });

    return null;
}

export default Logout;
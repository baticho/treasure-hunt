import { createContext, useContext } from "react";
import { useLocalStorage } from "./hooks/uselocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({
    children,
}) => {
    const [auth, setAuth] = useLocalStorage('auth', {});


    const userLogin = (authData) => {
        const authDataWithTimestamp = {
            ...authData,
            timestamp: new Date().getTime()
        };
        setAuth(authDataWithTimestamp);
    };

    const userLogout = () => {
        setAuth({});
    };

    return (
        <AuthContext.Provider value={{
            auth: auth,
            userLogin,
            userLogout,
            isAuthenticated: !!auth.access
        }}>
            {children}
        </AuthContext.Provider>  
    );
};

// Custom Hook
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    return context;
};

// With HOC
export const withAuth = (Component) => {
    const AuthWrapper = (props) => {
        const context = useContext(AuthContext);
        
        return <Component {...props} auth={context} />
    }

    return AuthWrapper;
} 
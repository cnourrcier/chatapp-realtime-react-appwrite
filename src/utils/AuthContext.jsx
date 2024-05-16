import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../appwriteConfig';
import { useNavigate } from 'react-router-dom';
import { ID } from 'appwrite';

const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    console.log(user);
    const navigate = useNavigate();

    useEffect(() => {
        getUserOnLoad();
    }, [])

    const getUserOnLoad = async () => {
        try {
            const accountDetails = await account.get();
            console.log('accountDetails: ', accountDetails);
            setUser(accountDetails);
        } catch (err) {
            console.warn(err);
        }
        setLoading(false);
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault();
        try {
            const res = await account.createEmailPasswordSession(
                credentials.email, // email
                credentials.password // password
            );
            const accountDetails = await account.get();
            setUser(accountDetails);
            //redirect user once account details are set
            navigate('/');
        } catch (err) {
            console.error(err)
        }
    }

    const handleUserLogout = async () => {
        await account.deleteSession('current')
        setUser(null);
    }

    const handleUserRegister = async (e, credentials) => {
        e.preventDefault();
        if (credentials.password !== credentials.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await account.create(
                ID.unique(),
                credentials.email,
                credentials.password,
                credentials.name
            )

            await account.createEmailPasswordSession(
                credentials.email, // email
                credentials.password // password
            );
            const accountDetails = await account.get();
            setUser(accountDetails);
            //redirect user once account details are set
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    }

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
        handleUserRegister
    }

    return <AuthContext.Provider value={contextData}>
        {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
}

// hook that allows access to AuthProvider for child components without having to import it each time.
export const useAuth = () => { return useContext(AuthContext) }

export default AuthContext;
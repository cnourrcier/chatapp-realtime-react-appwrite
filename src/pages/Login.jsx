import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

    const { user, handleUserLogin } = useAuth();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })

    //if user is already logged in, redirect back to home page.
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [])

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // square brackets around name to make it a dynamic value, so handleInputChange can be used for email and password.
        setCredentials({ ...credentials, [name]: value });
    }

    return (
        <div className='auth--container'>
            <div className='form--wrapper'>
                <form onSubmit={(e) => handleUserLogin(e, credentials)}>
                    <div className='field--wrapper'>
                        <label htmlFor="">Email</label>
                        <input
                            onChange={handleInputChange}
                            type='email'
                            required
                            name='email'
                            placeholder='Enter your email...'
                            value={credentials.email} />
                    </div>
                    <div className='field--wrapper'>
                        <label htmlFor="">Password</label>
                        <input
                            onChange={handleInputChange}
                            type='password'
                            required
                            name='password'
                            placeholder='Enter your password...'
                            value={credentials.password} />
                    </div>
                    <div className='field--wrapper'>
                        <input
                            className='btn btn--lg btn--main'
                            type='submit'
                            value='Login' />
                    </div>
                </form>
                <p>Don't have an account? Register <Link to='/register'>here</Link></p>
            </div>
        </div>
    )
}

export default Login
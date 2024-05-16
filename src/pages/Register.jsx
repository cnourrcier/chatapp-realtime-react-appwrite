import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Register = () => {

    const { handleUserRegister } = useAuth()

    const [credentials, setCredentials] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // square brackets around name to make it a dynamic value, so handleInputChange can be used for email, password, and confirmPassword.
        setCredentials({ ...credentials, [name]: value });
    }

    return (
        <div className='auth--container'>
            <div className='form--wrapper'>
                <form onSubmit={(e) => handleUserRegister(e, credentials)}>
                    <div className='field--wrapper'>
                        <label htmlFor="">Name:</label>
                        <input
                            onChange={handleInputChange}
                            type='text'
                            required
                            name='name'
                            placeholder='Enter your name...'
                            value={credentials.name} />
                    </div>
                    <div className='field--wrapper'>
                        <label htmlFor="">Email:</label>
                        <input
                            onChange={handleInputChange}
                            type='email'
                            required
                            name='email'
                            placeholder='Enter your email...'
                            value={credentials.email} />
                    </div>
                    <div className='field--wrapper'>
                        <label htmlFor="">Password:</label>
                        <input
                            onChange={handleInputChange}
                            type='password'
                            required
                            name='password'
                            placeholder='Enter your password...'
                            value={credentials.password} />
                    </div>
                    <div className='field--wrapper'>
                        <label htmlFor="">Confirm Password:</label>
                        <input
                            onChange={handleInputChange}
                            type='password'
                            required
                            name='confirmPassword'
                            placeholder='Confirm your password...'
                            value={credentials.confirmPassword} />
                    </div>
                    <div className='field--wrapper'>
                        <input
                            className='btn btn--lg btn--main'
                            type='submit'
                            value='Register' />
                    </div>
                </form>
                <p>Already have an account? Login <Link to='/login'>here</Link></p>
            </div>
        </div>
    )
}

export default Register
import { useState } from 'react';
import { useAuth } from '../../AuthenticationContext';


const LoginForm = ({toggleForm, closeLoginForm} : {toggleForm: () => void, closeLoginForm: () => void}) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    function logIn() {
        fetch(`${VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            login(data.adminKey, data.user);
            closeLoginForm(); // Close the login form after successful login
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    return (
        <>
            <h2>Logga in</h2>
            <div className='inputDiv'>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username" value={name} onChange={(e) => setName(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
            </div>

            <button onClick={logIn}>Log in</button>

            <button type="button" className='noButtonFormatting authenticationToggleButton' onClick={toggleForm}>Dont have an account? <span>Create one</span></button>
        </>
    )
};

export default LoginForm;
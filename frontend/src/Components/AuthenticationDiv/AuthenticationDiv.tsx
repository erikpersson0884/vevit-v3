import React, { useState } from 'react';
import './AuthenticationDiv.css';
import { useAuth } from '../../AuthenticationContext';


interface AuthenticationDivProps {
    showAuthenticationDiv: boolean;
    closeAuthenticationDiv: () => void;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AuthenticationDiv: React.FC<AuthenticationDivProps> = ({showAuthenticationDiv, closeAuthenticationDiv}) => {

    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    
    return (
        (showAuthenticationDiv) ?
            <div className="shadowBox" onClick={closeAuthenticationDiv}>
                <form className='authenticationForm popupWindow' onSubmit={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                    {(isLogin) ? 
                        <LoginForm toggleForm={toggleForm} closeLoginForm={closeAuthenticationDiv} /> 
                    : 
                        <RegisterForm toggleForm={toggleForm} closeForm={closeAuthenticationDiv} />
                    }
                </form>
            </div>
        :
            null
    );
}

export default AuthenticationDiv;


const LoginForm = ({toggleForm, closeLoginForm} : {toggleForm: () => void, closeLoginForm: () => void}) => {

    const { login } = useAuth();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

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

            <button type="button" className='noButtonFormatting authenticationToggleLink' onClick={toggleForm}>Dont have an account? <span>Create one</span></button>
        </>
    )
};

const RegisterForm = ({toggleForm, closeForm} : {toggleForm: () => void, closeForm: () => void}) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    function register() {
        if (newPassword !== repeatPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch(`${VITE_API_URL}/people/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newUser: {
                    name: newUsername,
                    password: newPassword
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            closeForm();
        })
    }

    return (
        <>
            <h2>Register</h2>

            <div className='inputDiv'>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="repeatPassword">Upprepa Lösenord:</label>
                <input type="password" id="repeatPassword" name="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required></input>
            </div>

            <button onClick={register}>Register</button>

            <button type="button" className='noButtonFormatting authenticationToggleLink' onClick={toggleForm}>Already have an account? <span>Log in</span></button>
        </>
    )
}
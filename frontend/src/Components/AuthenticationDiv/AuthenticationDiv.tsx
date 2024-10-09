import React, { useState } from 'react';
import './AuthenticationDiv.css';
import { useAuth } from '../../AuthenticationContext';


interface AuthenticationDivProps {
    showAuthenticationDiv: boolean;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const AuthenticationDiv: React.FC<AuthenticationDivProps> = ({showAuthenticationDiv}) => {

    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    
    return (
        (showAuthenticationDiv) ?
        <form className='authenticationForm popupWindow' onSubmit={(e) => e.preventDefault()}>
                {(isLogin) ? <LoginForm toggleForm={toggleForm}/> : <RegisterForm toggleForm={toggleForm} />
        }
            </form>
        :
            null
    );
}

export default AuthenticationDiv;


const LoginForm = ({toggleForm} : {toggleForm: () => void}) => {

    const { login } = useAuth();


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function logIn() {
        fetch(`${VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
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
            login(data.adminKey);
            showAuthenticationDiv = false;
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
                <input type="text" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} required></input>
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

const RegisterForm = ({toggleForm} : {toggleForm: () => void}) => {
    return (
        <>
            <h2>Register</h2>

            <div className='inputDiv'>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required></input>
            </div>

            <div className='inputDiv'>
                <label htmlFor="repeatPassword">Repeat Password:</label>
                <input type="password" id="repeatPassword" name="password" required></input>
            </div>

            <button>Register</button>

            <button type="button" className='noButtonFormatting authenticationToggleLink' onClick={toggleForm}>Already have an account? <span>Log in</span></button>
        </>
    )
};
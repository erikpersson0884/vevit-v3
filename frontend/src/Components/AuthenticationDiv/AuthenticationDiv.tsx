import React, { useState } from 'react';
import './AuthenticationDiv.css';

interface AuthenticationDivProps {
    showAuthenticationDiv: boolean;
}

const AuthenticationDiv: React.FC<AuthenticationDivProps> = ({showAuthenticationDiv}) => {

    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };
    
    return (
        (showAuthenticationDiv) ?
            <form className='authenticationForm popupWindow'>
                {(isLogin) ? <LoginForm toggleForm={toggleForm}/> : <RegisterForm toggleForm={toggleForm} />
        }
            </form>
        :
            null
    );
}

export default AuthenticationDiv;


const LoginForm = ({toggleForm} : {toggleForm: () => void}) => {
    return (
        <>
            <h2>Logga in</h2>
            <div className='inputDiv'>
                <label htmlFor="username">Användarnamn:</label>
                <input type="text" id="username"  required></input>
            </div>


            <div className='inputDiv'>
                <label htmlFor="password">Lösenord:</label>
                <input type="password" id="password" name="password" required></input>
            </div>

            <button>Log in</button>

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
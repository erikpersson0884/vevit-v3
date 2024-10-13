import React, { useState } from 'react';
import './AuthenticationDiv.css';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthenticationDivProps {
    showAuthenticationDiv: boolean;
    closeAuthenticationDiv: () => void;
}

const AuthenticationDiv: React.FC<AuthenticationDivProps> = ({showAuthenticationDiv, closeAuthenticationDiv}) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    React.useEffect(() => {
        if (!showAuthenticationDiv) {
            setIsLogin(true);
        }
    }, [showAuthenticationDiv]);
    
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

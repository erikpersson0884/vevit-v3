import React, { useState } from 'react';
import './AuthenticationDiv.css';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserDiv from './UserDiv';
import AccountDiv from './AccountDiv';

import { useAuth } from '../../Contexts/AuthenticationContext';

interface AuthenticationDivProps {
    showAuthenticationDiv: boolean;
    closeAuthenticationDiv: () => void;
}

const AuthenticationDiv: React.FC<AuthenticationDivProps> = ({showAuthenticationDiv, closeAuthenticationDiv}) => {
    const LoginDivContent = <LoginForm openRegisterDiv={() => setContent(RegisterDivContent)} close={closeAuthenticationDiv} />;

    const RegisterDivContent = <RegisterForm openLoginForm={() => setContent(LoginDivContent)} close={closeAuthenticationDiv} />;

    const UserDivContent = <UserDiv openAccountDiv={() => setContent(AccountDivContent)} />;

    const AccountDivContent = <AccountDiv openUserDiv={() => setContent(UserDivContent)} />;


    const [content, setContent] = useState<JSX.Element>(LoginDivContent);

    const setWindowContent = (newContent: JSX.Element) => {
        setContent(newContent);
    };

    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        if (isAuthenticated) {
            setWindowContent(UserDivContent);
        } else {
            setWindowContent(LoginDivContent);
        }

    }, [showAuthenticationDiv, isAuthenticated]);
    
    return (
        (showAuthenticationDiv) ?
            <div className="shadowBox" onClick={closeAuthenticationDiv}>
                <aside 
                    className='authenticationForm popupWindow' 
                    onSubmit={(e) => e.preventDefault()} 
                    onClick={(e) => e.stopPropagation()}
                >
                    {content}
                </aside>
            </div>
        :
            null
    );
}

export default AuthenticationDiv;

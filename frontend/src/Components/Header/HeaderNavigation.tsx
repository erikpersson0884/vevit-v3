import React from "react";

import { useAuth } from '../../Contexts/AuthenticationContext';


interface HeaderNavigationProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({openBookVev, openLogin}) => {

    const { isAuthenticated, logout } = useAuth();

    return (
        <aside className="headerNavigation">
            <button onClick={openBookVev}>Boka vev</button>
            {
                (isAuthenticated) ?
                    <button onClick={logout}>Logga ut</button>
                :
                    <button onClick={openLogin}>Logga in</button>
            }
        </aside>
    );
}

export default HeaderNavigation;
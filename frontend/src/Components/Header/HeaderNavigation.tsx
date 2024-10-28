import React from "react";

import { useAuth } from '../../Contexts/AuthenticationContext';


interface HeaderNavigationProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({openBookVev, openLogin}) => {

    const { isAuthenticated } = useAuth();

    return (
        <aside className="headerNavigation">
            <button onClick={openBookVev}>Boka vev</button>
            <button onClick={openLogin}>{(isAuthenticated) ? "Konto" : "Logga in"}</button>
        </aside>
    );
}

export default HeaderNavigation;
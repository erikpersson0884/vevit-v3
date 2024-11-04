import React from "react";

import { useAuth } from '../../Contexts/AuthenticationContext';
import { Link } from 'react-router-dom';

interface HeaderNavigationProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({openBookVev, openLogin}) => {

    const { isAuthenticated } = useAuth();

    return (
        <aside className="headerNavigation">
            <button onClick={openBookVev}>Boka vev</button>
            <Link className="noAFormatting" to="/stats">
                <button>Statistik</button>
                </Link>
            <button onClick={openLogin}>{(isAuthenticated) ? "Konto" : "Logga in"}</button>
        </aside>
    );
}

export default HeaderNavigation;
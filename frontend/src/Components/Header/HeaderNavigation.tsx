import React from "react";

interface HeaderNavigationProps {
    openBookVev: () => void;
    openLogin: ()=> void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({openBookVev, openLogin}) => {
    return (
        <aside className="headerNavigation">
            <button onClick={openBookVev}>Boka vev</button>
            <button onClick={openLogin}>Login</button>
        </aside>
    );
}

export default HeaderNavigation;
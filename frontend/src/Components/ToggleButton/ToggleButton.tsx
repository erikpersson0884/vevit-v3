import React from "react";
import './ToggleButton.css';

interface ToggleButtonProps {
    toggleFunction: () => void;
    option1: string;
    option2: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ toggleFunction, option1, option2 }) => {

    function toggle() {
        setIsOption1(!isOption1);
        toggleFunction();
    }

    const [isOption1, setIsOption1] = React.useState(true);

    return (
        <div className="toggleButton" onClick={toggle}>
            <div className={isOption1? "activeOption" : ""}>
                {option1}
            </div>
            <div className={isOption1? "" : "activeOption"}>
                {option2}
            </div>
        </div>
    );
};

export default ToggleButton;
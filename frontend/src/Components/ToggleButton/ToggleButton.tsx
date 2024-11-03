import React from "react";
import './ToggleButton.css';

interface ToggleButtonProps {
    className?: string;
    toggleFunction: () => void;
    initialOption?: string;
    option1: string;
    option2: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ className="", toggleFunction, initialOption, option1, option2 }) => {

    if (initialOption !== option1 && initialOption !== option2) {
        throw new Error('initialOption must be either option1 or option2');
    }

    function toggle() {
        setIsOption1(!isOption1);
        toggleFunction();
    }

    const [isOption1, setIsOption1] = React.useState<boolean>(initialOption === option1 ? true : false);

    return (
        <div className={`${className} toggleButton`} onClick={toggle}>
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
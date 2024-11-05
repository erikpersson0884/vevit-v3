import React from "react";
import "./ShadowBox.css";

interface ShadowBoxProps {
    children?: React.ReactNode;
    backgroundColor?: string;
    show: boolean;
    setShow: (show: boolean) => void;
}

const ShadowBox: React.FC<ShadowBoxProps> = ({children, backgroundColor = null, show=true, setShow}) => {
    function handleClose(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setShow(false);
    }


    return (
        show &&
        <div onClick={(e) => handleClose(e)} className="shadowBox" style={backgroundColor ? { backgroundColor } : undefined}>
            {children}
        </div> 
    );
};

export default ShadowBox;

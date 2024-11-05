import './PopupDiv.css';
import React from 'react';
import ShadowBox from '../ShadowBox/ShadowBox';

interface PopupDivProps {
    children: React.ReactNode;
    show: boolean;
    setShow: (show: boolean) => void;
}


const PopupDiv: React.FC<PopupDivProps> = ({children, show, setShow}) => {

    return (
        <ShadowBox show={show} setShow={setShow}>
            <div className="popupDiv" onClick={(e) => e.stopPropagation()}>
                <button className="closeButton" onClick={() => setShow(false)}>
                    <img src="/images/close.svg" alt="Close button" />
                </button>
                {children}
            </div>
        </ShadowBox>
    )
}

export default PopupDiv;

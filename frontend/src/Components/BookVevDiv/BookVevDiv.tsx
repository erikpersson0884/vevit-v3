import React from 'react';
import './BookVevDiv.css';

import { User } from '../../types';

interface BookVevDivProps {
    showBookVev: boolean;
    user: User;
}

const BookVevDiv: React.FC<BookVevDivProps> = ({showBookVev, user}) => {

    

    return (
        (showBookVev) ?
        <div className='popupWindow bookVevDiv'>
            <h2>Boka vev</h2>

            <div className='inputDiv'>
                <p>Utmanare:</p>
                <p>{user.name}</p>
            </div>


            <div className='inputDiv'>
                <label htmlFor="password">Utmana:</label>
                <select>
                    <option value="Göken">Göken</option>
                    <option value="Göken">Göken</option>
                    <option value="Göken">ojäm</option>
                    <option value="Göken">Göken</option>
                </select>
            </div>

            <label htmlFor="vevReasonTextarea">Datum:</label>
            <textarea id="vevReasonTextarea" placeholder='Anledning...' ></textarea>

            <button>Boka vev</button>
        </div>
        :
        null
    )
};

export default BookVevDiv;
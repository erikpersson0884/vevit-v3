import React from 'react';
import './BookVevDiv.css';

interface BookVevDivProps {
    showBookVev: boolean;
    user: string;
}

const BookVevDiv: React.FC<BookVevDivProps> = ({showBookVev, user}) => {

    

    return (
        (showBookVev) ?
        <div className='popupWindow bookVevDiv'>
            <h2>Boka vev</h2>

            <div className='inputDiv'>
                <p>Utmanare:</p>
                <p>{user}</p>
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
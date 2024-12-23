import React from "react";
import './AdminPage.css';
import { useVevContext } from "../../Contexts/VevContext";
import { usePeopleContext } from "../../Contexts/PeopleContext";
import ToggleButton from "../ToggleButton/ToggleButton";

const AdminPage = () => {
    const [showUsers, setShowUsers] = React.useState(true);

    return (
        <div className="adminPage">
            <ToggleButton className="" option1="Users" option2="Vev" initialOption="Users" toggleFunction={() => setShowUsers(!showUsers)} />
            {showUsers ? 
                <ManageUsers />
            :
                <ManageVevs />
            }
        </div>
    );
};

export default AdminPage;

const ManageUsers = () => {
    const allPeople = usePeopleContext().allPeople;

    const resetPassword = (userId: string) => {
        fetch(`/api/people/resetPassword`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId
            })
        })
        .then(response => {
            if (response.status === 200) {
                alert('Password has been reset');
            } else {
                alert('Error resetting password');
            }
        })
        .catch(() => {
            alert('Error resetting password');
        });
    }

    const deleteUser = (userId: string) => {
        fetch(`/api/people`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId
            })
        })
        .then(response => {
            if (response.status === 200) {
                alert('User has been deleted');
            } else {
                alert('Error deleting user');
            }
        })
        .catch(() => {
            alert('Error deleting user');
        });
    }

    return (
        <>
            <header className="listItem">
                <h3>Username</h3>
                <h3>Reset Password</h3>
                <h3>Delete User</h3>
            </header>
            
            <ul className="contextList">
                {allPeople.map((user: { id: string; name: string }, index: number) => (
                    <li key={user.id} className={`listItem ${index % 2 === 0 ? 'dark' : ''}`}>
                        <p>{user.name}</p>
                        <button onClick={() => resetPassword(user.id)}>Reset Password</button>
                        <button onClick={() => deleteUser(user.id)}>Delete User</button>
                    </li>
                ))} 
            </ul>
        </>
    )
}

const ManageVevs = () => {
    const allVevs = useVevContext().allVevs;

    const deleteVev = (event: React.MouseEvent<HTMLButtonElement>, vevId: string): void => {
        event?.stopPropagation();

        fetch(`/api/vev`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                vevId: vevId
            })
        })
        .then(response => {
            if (response.status === 200) {
                alert('Vev has been deleted');
            } else {
                alert('Error deleting vev');
            }
        })
        .catch(() => {
            alert('Error deleting vev');
        });
    }

    return (
        <>
            <header className="listItem">
                <h3>Challanger</h3>
                <h3>Challanged</h3>
                <h3>Time</h3>
                <h3>Delete Vev</h3>
            </header>

            <ul className="contextList">
                {allVevs.map((vev: { id: string; challenger: { name: string }; challenged: { name: string }; time: string }, index: number) => (
                    <li key={vev.id} className={`listItem ${index % 2 === 0 ? 'dark' : ''}`}>
                        <p>{vev.challenger.name}</p>
                        <p>{vev.challenged.name}</p>
                        <p>{vev.time}</p>
                        <button onClick={(e) => deleteVev(e, vev.id)} >Delete Vev</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

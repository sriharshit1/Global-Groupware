import React from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
    return (
        <div
            style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                margin: '10px',
                width: '200px',
                textAlign: 'center',
            }}
        >
            <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                style={{ borderRadius: '50%', width: '100px', height: '100px' }}
            />
            <h3>
                {user.first_name} {user.last_name}
            </h3>
            <p>{user.email}</p>
            <button onClick={() => onEdit(user)} style={{ margin: '5px' }}>
                Edit
            </button>
            <button
                onClick={() => onDelete(user.id)}
                style={{ margin: '5px', backgroundColor: 'red' }}
            >
                Delete
            </button>
        </div>
    );
};

export default UserCard;
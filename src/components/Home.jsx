import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import{Button} from '@mui/material'
import UserCard from './UserCard';

const Home = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const[searchQuery,setSearchQuery] = useState('')

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must log in first!');
            navigate('/');
        } else {
            // Redirect back to login page after 30 seconds
            const timer = setTimeout(() => {
                alert('Session expired. Redirecting to login page...');
                navigate('/');
            }, 30000); 

          
            return () => clearTimeout(timer);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (currentPage) => {
        try {
            const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
            setUsers(response.data.data);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://reqres.in/api/users/${id}`);
            setMessage('User deleted successfully!');
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Failed to delete user.');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, {
                first_name: selectedUser.first_name,
                last_name: selectedUser.last_name,
                email: selectedUser.email,
            });
            setMessage('User updated successfully!');
            setIsEditing(false);

            setUsers(users.map((user) => 
                user.id === selectedUser.id ? { ...user, ...response.data } : user
            ));
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage('Failed to update user.');
        }
    };

    const filteredUsers = users.filter((user)=> `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>User List</h1>
            {message && <p style={{ color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {users.map((user) => (
                    <div
                        key={user.id}
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
                        <button onClick={() => handleEdit(user)} style={{ margin: '5px' }}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} style={{ margin: '5px', backgroundColor: 'pink' }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px' }}>
                <Button
                    variant ="contained"
                    color='primary'
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </Button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <Button
                    varient="contained"
                    color='primary'
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </Button>
            </div>
            {isEditing && selectedUser && (
                <div style={{ marginTop: '20px', textAlign: 'left', display: 'inline-block' }}>
                    <h2>Edit User</h2>
                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>First Name:</label>
                            <input
                                type="text"
                                value={selectedUser.first_name}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, first_name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={selectedUser.last_name}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, last_name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser({ ...selectedUser, email: e.target.value })
                                }
                            />
                        </div>
                        <button type="submit" style={{ marginTop: '10px' }}>
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            style={{ marginTop: '10px', marginLeft: '10px', backgroundColor: 'gray' }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
            <div style={{margin:"20px"}}>
                <input type="text" 
                placeholder='Search users by name'
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                style={{padding:"10px",width:"300px"}}
                />
            </div>
            <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
                {filteredUsers.map((user)=>(
                    <UserCard user={user} key={user.id}/>
                ))}
            </div>
        </div>
    );
};

export default Home;
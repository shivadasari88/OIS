import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext'; // Import your UserContext

export default function UpdateProfile() {
    const navigate = useNavigate();
   const { user, setUser } = useContext(UserContext); // Assuming UserContext provides user and setUser
    
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        gender: '', // Added gender field
        phone: '',  // Added phone field
    });

    useEffect(() => {
        // Load user data into form when component mounts
        // This example assumes user data is already available in the context
        if (user) {
            setUserData({
                username: user.name || '',
                email: user.email || '',
                gender: user.gender || '',
                phone: user.phone || '',
            });
        }
    }, [user]);


    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/update',userData );
            toast.success('Profile saved successfully!');
            // Additional actions based on response
        } catch (error) {
            toast.error('Failed to save profile.');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <form onSubmit={updateUser}>
                <label>Name</label>
                <input type='text' name='username' value={userData.name} onChange={handleInputChange}/>
                <label>Email</label>
                <input type='email' name='email' value={userData.email} onChange={handleInputChange}/>
                <label>Gender</label>
                <input type='text' name='gender' value={userData.gender} onChange={handleInputChange}/> {/* Consider using select for predefined options */}
                <label>Phone</label>
                <input type='text' name='phone' value={userData.phone} onChange={handleInputChange}/>
                <button type='submit'>Update</button>
            </form>
        </div>
    );
}
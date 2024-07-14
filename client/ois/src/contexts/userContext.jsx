import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // The check !user ensures the request is only made once, when the component mounts.
        // If you plan on allowing the user to "log out" within the app,
        // you might need additional logic here to handle that scenario.
        if (!user) {
            axios.get('/profile').then(({ data }) => {
                setUser(data);
            }).catch(error => {
                console.error("Failed to fetch user profile:", error);
                // You might want to handle errors more gracefully here,
                // depending on your application's requirements.
            });
        }
    }, [user]); // Adding 'user' here as a dependency, though in this specific case it might be unnecessary due to the conditional check inside the effect.

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

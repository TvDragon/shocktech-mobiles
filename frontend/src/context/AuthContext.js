import React, { createContext, useState} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthConProvider = ({children}) => {

    const [user, setUser] = useState(() => {
        let userToken = localStorage.getItem("auth-token");
        if(userToken){
            axios.post('/api/getUserFromToken', {token: userToken})
            .then((res) => {
                return res.data.token.user;
            })
            .catch((err) => {
                let tempUser = {
                    firstname: '',
                    lastname: '',
                    email: '',
                    password: '',
                };
                return tempUser;
            });
        } else {
            return null;
        }
    });

    const updateUser = (user) => {
        setUser(user);
    }

    return(
        <AuthContext.Provider value={{user, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
/**
 * File for simple authorisation control
 * Creating context with all required information for User
 *
 * @author Albert Tikaiev
 */

import {createContext, useContext, useState} from "react";

const UserContext = createContext();

/**
 * Functions(reducers) and context wrapper
 *
 * @param children Parts to be wrapped around context provider
 */
export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    function loginUser (userInformation) {
        setUser(userInformation);
    }

    function logoutUser(){
        setUser(null);
    }

    function updateUserAvatar(avatarId) {
        setUser(prevState => ({...prevState, avatar : avatarId,}));
    }

    return(
        <UserContext.Provider value={{user, loginUser, logoutUser, updateUserAvatar}}>
            {children}
        </UserContext.Provider>
    )
}

//Hook to use UserContext and functions from UserContextProvider
export const useUser = () => useContext(UserContext);


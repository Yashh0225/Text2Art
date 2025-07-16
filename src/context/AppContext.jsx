import {createContext, useState} from 'react';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(true);//user logged in or not
    const [showLogin, setShowLogin] = useState(false);

    const value = {//created an object to return
        user, setUser, showLogin, setShowLogin
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
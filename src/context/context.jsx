import { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [accessToken, setAccessToken] = useState("");

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
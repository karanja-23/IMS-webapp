import { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [accessToken, setAccessToken] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [team, setTeam] = useState([]);
    const [roles, setRoles] = useState([])
    const [assets, setAssets] = useState([])
    const [vendors, setVendors] = useState([])

    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken, isOpen,setIsOpen, toggle, team, setTeam, roles, setRoles, assets, setAssets, vendors,setVendors}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
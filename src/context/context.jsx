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
    const [categories, setCategories] =useState([])
    const [spaces, setSpaces] = useState([])
    const [requests,setRequests] = useState([])
    const [returns, setReturns] =useState([])
    const [permissions, setPermissions] = useState([]);
    const [inventories, setInventories] = useState([])
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken, isOpen,setIsOpen, toggle, team, setTeam, roles, setRoles, assets, setAssets, vendors,setVendors,categories, setCategories, spaces, setSpaces, requests, setRequests, returns,setReturns,permissions,setPermissions, inventories, setInventories}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
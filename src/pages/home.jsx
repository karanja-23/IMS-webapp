import { AppContext } from "../context/context";
import { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../components/sidebar";
function Home() {
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token){
            setAccessToken(token)
            fetch(`http://172.236.2.18:5000/users/protected/user`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    setUser(data);  
                    setLoggedIn(true);
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/");
                }, 1000);                             
                  }
                })
            }
            else{
                navigate("/login")
            }
      
    }, [loggedIn]);
    return (
        <div className="main">           
            <SidebarComponent />
        </div>
    );
}
export default Home;
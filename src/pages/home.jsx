import { AppContext } from "../context/context";
import { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../components/sidebar";
import "../CSS/home.css"
function Home() {
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (loggedIn) {
        navigate("/");
      }
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
                    setIsLoading(false)                            
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
            <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 220px)' : 'calc(100vw - 80px)',left: isOpen ? 210 : 70}} >

            </div>
        </div>
    );
}
export default Home;
import { AppContext } from "../context/context";
import { useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../components/sidebar";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import "../CSS/home.css"
import { ToastContainer } from "react-toastify";
function Home() {
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (loggedIn) {
      
        navigate("/");
      }   
      else {
        const token = localStorage.getItem("token");

        if (token){
            setAccessToken(token)
            fetch(`https://mobileimsbackend.onrender.com/protected/user`, {
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
      }
      
    }, [loggedIn]);
    return (
        <div className="main">  
            <ToastContainer />         
            <SidebarComponent />
            <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header">
                <div className="title">                
                    <h2>Dashboard</h2>
                    
                </div>
                <div className="notification">
                    <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
                    
                </div>

            </div>
        </div>
        </div>
    );
}
export default Home;
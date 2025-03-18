import SidebarComponent from "../components/sidebar";
import { useContext, useEffect,useState } from "react";
import { useParams,useLocation } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import Loading from "../components/loading";
import image from '../assets/user.png'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import "../CSS/users.css"
import Notification from "../components/notification";
function ViewUsers() {
    const{isOpen} = useContext(AppContext)
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(null);
    const id = location.state?.id
    useEffect(() => {
       
      fetch(`https://mobileimsbackend.onrender.com/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setCurrentUser(data);
            setLoading(false);
          }
        });
    },[])

    return (
    <div className="main">           
        <SidebarComponent />
        
            <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header">
                <div className="title">                
                   {loading ? null :  <h3>Profile/{currentUser.username}</h3> }                           
                </div>
                <Notification />
                       

            </div>
            <div className="back-button " onClick={() => window.history.back()} >
                <ArrowBackIosRoundedIcon style={{marginRight: '10px', fontSize: '1.3rem'}}/>
                <span style={{fontSize: '0.97rem'}} >back</span>
            </div>
            {loading ? (<Loading />) : 
              <div className="profiles">

              <div className="profile-img">
                  <img src={image} alt="user" />            
              </div>
              <div className="profile-details">
               <div>
               <span><strong>Username:</strong> {currentUser.username}</span>
               <span><strong>Email:</strong> {currentUser.email}</span>    
               </div>
               <div>
               <span><strong>Role:</strong> {currentUser.role.name}</span>
               <span><strong>Contact:</strong> {currentUser.contact}</span>
               </div>
                  
              </div>
          </div>
            }
            
        </div>         
         
       
    </div>
    )
}
export default ViewUsers
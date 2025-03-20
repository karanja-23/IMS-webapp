import SidebarComponent from "../components/sidebar";
import { useContext, useEffect,useState } from "react";
import { useParams,useLocation } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import Loading from "../components/loading";
import image from '../assets/barcode.png'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import "../CSS/viewAssets.css"
import Notification from "../components/notification";
function ViewAssets() {
    const{isOpen} = useContext(AppContext)
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [currentAsset, setCurrentAsset] = useState(null);
    const id = location.state?.id
    useEffect(() => {
       
      fetch(`https://mobileimsbackend.onrender.com/assets/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            
            setCurrentAsset(data);
            setLoading(false);
          }
        });
    },[])

    return (
    <div className="main">           
        <SidebarComponent />
        
            <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header" style={{width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',transition: '0.3s'}}>
                <div className="title">                
                   {loading ? null :  <h3>Asset / {currentAsset.name}</h3> }                           
                </div>
                <Notification />
                       

            </div>
            <div className="back-button-container " >
            <div className="back-button "  onClick={() => window.history.back()}>
            <ArrowBackIosRoundedIcon
            style={{ marginRight: "10px", fontSize: "1.3rem" }}
          />
          <span style={{ fontSize: "0.97rem" }}>back</span>             
            </div>
        </div>
            {loading ? (<Loading />) : 
              <div className="profiles">

              <div className="profile-img">
                  <img src={image}  alt="user" />            
              </div>
              <div className="profile-details">
               <div style={{width: '30%'}}>
               <span><strong>Asset name:</strong> {currentAsset.name}</span>
               <span><strong>Serial number:</strong> {currentAsset.serial_number}</span> 
               <span><strong>Status:</strong> {currentAsset.status}</span>  

               </div>
               <div style={{width:'60%'}}>
               <span><strong>Category:</strong> {currentAsset.category['name']}</span>
               <span><strong>Current Location:</strong> {currentAsset.space['name']}</span>
               <span><strong>Description:</strong> {currentAsset.description}</span> 
               </div>
                  
              </div>
          </div>
            }
            
        </div>         
         
       
    </div>
    )
}
export default ViewAssets
import Sidebar from "react-sidebar";
import { useContext, useState, useEffect, useLayoutEffect } from "react";
import { AppContext } from "../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import logo from "../assets/smallLogo.png";
import { NavLink } from "react-router-dom";
import VideoLabelRoundedIcon from '@mui/icons-material/VideoLabelRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import AssignmentReturnRoundedIcon from '@mui/icons-material/AssignmentReturnRounded';
import AddBusinessRoundedIcon from '@mui/icons-material/AddBusinessRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import "../CSS/sidebar.css"
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
function  SidebarComponent() {
  const navigate = useNavigate()
    const {isOpen, toggle,user, setLoggedIn, setUser, setTeam,setAccessToken} = useContext(AppContext);
    const [width, setWidth] = useState(200);
    const [showLogo, setShowLogo] = useState(true);
    
    useLayoutEffect(() => {
      if (!isOpen) {
        setWidth(60);
        setShowLogo(false);
      }
    },[isOpen])
    const handleToggle = (e) => {
      e.stopPropagation();
      toggle();
      setShowLogo(!showLogo);
      setWidth(isOpen ? 60 : 200);
    }
    function handleLogout(){
     
      toast(
        ({ closeToast }) => (
          <div>
            <p>Are you sure you want to logout?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={() => {                              
                  closeToast();
                  localStorage.removeItem("token")
                  localStorage.removeItem("team")
                  setTeam([])
                  setUser({})
                  setLoggedIn(false)
                  setAccessToken("")
                  navigate("/login")
  
                }}
                style={{
                  backgroundColor:"#07013A",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                Yes
              </button>
              <button
                onClick={closeToast}
                style={{
                  backgroundColor: "#FC4F11",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "3px",

                }}
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false, 
          closeOnClick: false,
          draggable: false,
          hideProgressBar: true,
          theme: "light",
          
        }
      );
    }
    
        return (
            <div className="sidebar"
            style={{ width: width, transition: 'width 0.2s', boxSizing: 'border-box'}}
             >
            <div style={{ display: 'flex', alignItems: 'center', width: width, justifyContent: 'center', gap: '30px', marginBottom: '30px'}}>
            <img src={logo} alt="Logo" style={{display : showLogo ? 'block' : 'none' ,width: '65%', height: 'auto', marginBottom: '10px' }} />
            <div onClick={handleToggle}>
              {isOpen ? <MenuRoundedIcon style={{fontSize: '1.6rem'}}/> : <FontAwesomeIcon icon={faBars}    style={{ cursor: 'pointer',fontSize: '1.2rem',color: '#07013A',justifySelf: isOpen ? 'flex-start' : 'center', marginTop: isOpen ? '-10px' : '7px', marginRight: isOpen ? '10px' : '0' }} /> }
            </div>
            
            </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOpen ? 'flex-start' : 'center'}}>
                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center', boxSizing: 'border-box', width: '100%'}}  >
                    <NavLink style={{display: "flex", width: '100%'}} to="/" className="link">
                    <DashboardRoundedIcon aria-label = {isOpen ? '' : 'Dashboard'} className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Dashboard</span>            
                    </NavLink>
                </div>

                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/fixedAssets" className="link">
                    <VideoLabelRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Fixed Assets</span>            
                    </NavLink>
                </div>
                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/orders" className="link">
                    < AssignmentRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Orders</span>            
                    </NavLink>
                </div>

                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/vendors" className="link">
                    <AddBusinessRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Vendors</span>            
                    </NavLink>
                </div>

                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}}  >
                    <NavLink style={{display: "flex",}} to="/requests" className="link">
                    < AssignmentIndRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Requests</span>            
                    </NavLink>
                </div>
                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}}  >
                    <NavLink style={{display: "flex",}} to="/returns" className="link">
                    < AssignmentReturnRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Returns</span>            
                    </NavLink>
                </div>
                
                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/spaces" className="link">
                    <LocationCityRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Spaces</span>            
                    </NavLink>
                </div> 
                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/team" className="link">
                    < PeopleRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Users</span>            
                    </NavLink>
                </div>    

                <div className="item" style={{justifyContent: isOpen ? 'flex-start' : 'center'}} >
                    <NavLink style={{display: "flex",}} to="/permissions" className="link">
                    < RuleFolderRoundedIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Permissions</span>            
                    </NavLink>
                </div>                            
                
              </div>
              <div className="profile">
                <AccountCircleRoundedIcon className="icon" style={{fontSize: '2.3rem'}}/>
                <span style={{display: isOpen ? 'block' : 'none', fontSize: '0.8rem',fontWeight: '400'}}>{user.username}</span>
              </div>
              
              <div className="logout" onClick={handleLogout}>
                <LogoutRoundedIcon style={{fontSize: '1.5rem'}}/>
                <span style={{display: isOpen ? 'block' : 'none', fontSize: '0.9rem',fontWeight: '500'}}>Logout</span>
              </div>
            </div>
          );
}

export default SidebarComponent

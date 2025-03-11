import Sidebar from "react-sidebar";
import { useContext, useState } from "react";
import { AppContext } from "../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import HomeIcon from '@mui/icons-material/Home';
import logo from "../assets/smallLogo.png";
import { NavLink } from "react-router-dom";

import "../CSS/sidebar.css"
function  SidebarComponent() {
    const {isOpen, toggle} = useContext(AppContext);
    const [width, setWidth] = useState(200);
    const [showLogo, setShowLogo] = useState(true);
    const handleToggle = () => {
        toggle();
        setShowLogo(!showLogo);
        setWidth(isOpen ? 60 : 250);

    }
    
        return (
            <div className="sidebar"
            style={{ width: width, transition: 'width 0.3s' }}
             >
            <div style={{ display: 'flex', alignItems: 'center', width: width, justifyContent: 'center', gap: '30px', marginBottom: '30px'}}>
            <img src={logo} alt="Logo" style={{display : showLogo ? 'block' : 'none' ,width: '70%', height: 'auto', marginBottom: '10px' }} />
            <FontAwesomeIcon icon={faBars}  size="lg" onClick={handleToggle} style={{ cursor: 'pointer',color: '#07013A;',alighnSelf: 'flex-start', marginTop: isOpen ? '-10px' : '7px', marginRight: '10px' }} />
            </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="item"  >
                    <NavLink style={{display: "flex",}} to="/" className="link">
                    <HomeIcon className="icon"/>
                    <span className="text" style={{display: isOpen ? 'block' : 'none'}}>Dashboard</span>            
                    </NavLink>
                </div>
                <div>Vendors</div>
                <div>Orders</div>
              </div>
            </div>
          );
}

export default SidebarComponent

import SidebarComponent from "../components/sidebar";
import { useContext } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
function Spaces() {
    const{isOpen} = useContext(AppContext)
    return (
    <div className="main">           
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header">
                <div className="title">                
                    <h2>Spaces</h2>
                    
                </div>
                <div className="notification">
                    <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
                    
                </div>

            </div>
        </div>
    </div>
    )
}
export default Spaces
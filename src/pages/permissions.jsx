import SidebarComponent from "../components/sidebar";
import { useContext } from "react";
import { AppContext } from "../context/context";
function Permissions() {
    const{isOpen} = useContext(AppContext)
    return (
    <div className="main">           
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 220px)' : 'calc(100vw - 80px)',left: isOpen ? 210 : 70}} >

        </div>
    </div>
    )
}   
export default Permissions
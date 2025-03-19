import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Notification from "../components/notification";
import Loading from "../components/loading";
import { useLocation } from "react-router-dom";
function EditVendors() {
    const location = useLocation();
    const { isOpen } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const id = location.state?.id
    console.log(id)
    return (
        <div className="main">
            <SidebarComponent />
            <div
        className="content"
        style={{
          boxSizing: "border-box",
          width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
          left: isOpen ? 202 : 62,
          transition: "0.3s",
        }}
      >
        <div className="header">
          <div className="title">
            <h3>view /vendor</h3>
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
        </div>
        </div>
    )
}   

export default EditVendors
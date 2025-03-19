import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Notification from "../components/notification";
import Loading from "../components/loading";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useLocation } from "react-router-dom";
import image from "../assets/company.png";
import "../CSS/viewVendor.css";
import locations from "../assets/location.png";
import payment from "../assets/secure-payment.png";
import contact from "../assets/customer-support.png";
function ViewVendors() {
  const location = useLocation();
  const { isOpen } = useContext(AppContext);
  const [currentVendor, setCurrentVendor] = useState({});
  const [loading, setLoading] = useState(true);
  const id = location.state?.id;
  useEffect(() => {
    fetch(
      `https://mobileimsbackend.onrender.com/vendors/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      []
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setCurrentVendor(data);
          setLoading(false);
        }
      });
  });
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
        {loading ? (
          <Loading />
        ) : (
          <div>
            <div className="profiles">
              <div className="profile-img">
                <img
                  style={{
                    opacity: "0.7",
                    border: "none",
                    width: "100%",
                    height: "100%",
                    maxWidth: "250px",
                    maxHeight:"250px",
                    minHeight: "150px",
                    minWidth: "150px"
                  }}
                  src={image}
                  alt="user"
                />
              </div>
              <div
                className="profile-details"
                style={{ marginLeft: "20px", gap: "30px" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--blue)",
                      fontWeight: "500",
                      opacity: "0.7",
                    }}
                  >
                    <strong style={{ color: "var(--orange)" }}>
                      Business Name:
                    </strong>{" "}
                    {currentVendor.name}
                  </span>
                  <span
                    style={{
                      color: "var(--blue)",
                      fontWeight: "500",
                      opacity: "0.7",
                    }}
                  >
                    <strong style={{ color: "var(--orange)" }}>Email:</strong>{" "}
                    {currentVendor.email}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--blue)",
                      fontWeight: "500",
                      opacity: "0.7",
                    }}
                  >
                    <strong style={{ color: "var(--orange)" }}>
                      Phone Number:
                    </strong>{" "}
                    {currentVendor.contact}
                  </span>
                  <span
                    style={{
                      color: "var(--blue)",
                      fontWeight: "500",
                      opacity: "0.7",
                    }}
                  >
                    <strong style={{ color: "var(--orange)" }}>KRA Pin:</strong>{" "}
                    {currentVendor.kra_pin}
                  </span>
                </div>
              </div>
            </div>
            <div className="vendor-infor">
                <div className="infor-containers" >
                    <span className="infor-title">contact person</span>
                    <img className="infor-img" src={contact} alt="contact" />
                    <div className="contact-infor">
                        <span ><strong style={{color: 'var(--orange)'}}>Name:</strong> {currentVendor.contact_person_name}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Phone:</strong> {currentVendor.contact_person_contact}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Email:</strong> {currentVendor.contact_person_email}</span>
                    </div>

                </div>
                <div className="infor-containers" >
                    <span className="infor-title">address</span>
                    <img className="infor-img" src={locations} alt="location" />
                    <div className="contact-infor">
                        <span><strong style={{color: 'var(--orange)'}}>Address:</strong> {currentVendor.address}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Postal Code:</strong> {currentVendor.postal_code}</span>
                        <span><strong style={{color: 'var(--orange)'}}>City:</strong> {currentVendor.city}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Country:</strong> {currentVendor.country}</span>
                    </div>

                </div>
                <div className="infor-containers" >
                    <span className="infor-title">Payment details</span>
                    <img className="infor-img" src={payment} alt="payment" />
                    <div className="contact-infor">
                        <span><strong style={{color: 'var(--orange)'}}>Bank Name:</strong> {currentVendor.bank_name}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Account Number:</strong> {currentVendor.account_number}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Account Name:</strong> {currentVendor.account_name}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Paybill number:</strong> {currentVendor.paybill_number}</span>
                        <span><strong style={{color: 'var(--orange)'}}>Till number:</strong> {currentVendor.till_number}</span>
                    </div>

                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ViewVendors;

import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Notification from "../components/notification";
import Loading from "../components/loading";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../CSS/editVendor.css";
function EditVendors() {
  const location = useLocation();
  const navigate = useNavigate()
  const { isOpen } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const id = location.state?.id;
  const [currentVendor, setCurrentVendor] = useState(false);

  const [vendorData, setVendorData] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    kraPin: "",
    businessAddress: "",
    postalAddress: "",
    city: "",
    country: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    payBillNumber: "",
    tillNumber: "",
  });
  useEffect(() => {
    fetch(`https://mobileimsbackend.onrender.com/vendors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["city"]) {
          setLoading(false);
          setVendorData({
            businessName: data.name,
            businessEmail: data.email,
            businessPhone: data.contact,
            kraPin: data.kra_pin,
            businessAddress: data.address,
            postalAddress: data.postal_code,
            city: data.city,
            country: data.country,
            contactName: data.contact_person_name,
            contactEmail: data.contact_person_email,
            contactPhone: data.contact_person_contact,
            bankName: data.bank_name,
            accountNumber: data.account_number,
            accountName: data.account_name,
            payBillNumber: data.paybill_number,
            tillNumber: data.till_number,
          });
        }
      });
  }, []);
  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
};

function handleSubmit(e){
    e.preventDefault()
    const newVendor = {
        name:vendorData.businessName,
            email:vendorData.businessEmail,
            contact : vendorData.businessPhone,
            kra_pin :vendorData.kraPin,
            address:vendorData.businessAddress,
            postal_code:vendorData.postalAddress,
            city:vendorData.city,
            bank_name:vendorData.bankName,
            account_name:vendorData.accountName,
            account_number:vendorData.accountNumber,
            country:vendorData.country,
            paybill_number:vendorData.payBillNumber,
            till_number:vendorData.tillNumber,
            contact_person_name:vendorData.contactName,
            contact_person_email: vendorData.contactEmail,
            contact_person_contact: vendorData.contactPhone

    }
   
    fetch(`https://mobileimsbackend.onrender.com/vendors/${id}`,{
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newVendor)
    })
    .then(response => response.json())
    .then((data) =>{
        if (data["message"] === 'Vendor updated'){
            toast("Vendor updated succesfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                className: "toast-message",
                bodyClassName: "toast-message-body",
              });
              setTimeout(() =>{
                navigate('/vendors')
              },2000)
        }
    })
}
  return (
    <div className="main">
      <SidebarComponent />
      <ToastContainer />
      <div
        className="content"
        style={{
          boxSizing: "border-box",
          width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
          left: isOpen ? 202 : 62,
          transition: "0.3s",
        }}
      >
        <div
          className="header"
          style={{
            width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
            transition: "0.3s",
          }}
        >
          <div className="title">
            <h3>edit /vendor</h3>
          </div>
          <Notification />
        </div>
        <div className="back-button-container ">
          <div className="back-button " onClick={() => window.history.back()}>
            <ArrowBackIosRoundedIcon
              style={{ marginRight: "10px", fontSize: "1.3rem" }}
            />
            <span style={{ fontSize: "0.97rem" }}>back</span>
          </div>
        </div>
        <div>
        {loading ? <Loading /> : (
                        <div className="editVendor">
                            <form className="vendor-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <span className="form-title">Business Details</span>

                                    <div className="input-group">
                                        <label htmlFor="name">Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="businessName"
                                            value={vendorData.businessName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="businessEmail"
                                            value={vendorData.businessEmail}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="contact">Contact:</label>
                                        <input
                                            type="tel"
                                            id="contact"
                                            name="businessPhone"
                                            value={vendorData.businessPhone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="kra">KRA Pin:</label>
                                        <input
                                            type="text"
                                            id="kra"
                                            name="kraPin"
                                            value={vendorData.kraPin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <span className="form-title">Address</span>

                                    <div className="input-group">
                                        <label htmlFor="address">Address:</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="businessAddress"
                                            value={vendorData.businessAddress}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="postal">Postal address:</label>
                                        <input
                                            type="text"
                                            id="postal"
                                            name="postalAddress"
                                            value={vendorData.postalAddress}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="city">City:</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={vendorData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="country">Country:</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={vendorData.country}
                                            onChange={handleChange}
                                        />
                                        
                                    </div>
                                </div>
                                <div className="form-group">
                                    <span className="form-title">Contact person</span>

                                    <div className="input-group">
                                        <label htmlFor="c-name">Name:</label>
                                        <input
                                            type="text"
                                            id="c-name"
                                            name="contactName"
                                            value={vendorData.contactName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="c-email">Email:</label>
                                        <input
                                            type="email"
                                            id="c-email"
                                            name="contactEmail"
                                            value={vendorData.contactEmail}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="c-phone">Phone Number:</label>
                                        <input
                                            type="tel"
                                            id="c-phone"
                                            name="contactPhone"
                                            value={vendorData.contactPhone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <span className="form-title">Payment details</span>

                                    <div className="input-group">
                                        <label htmlFor="b-name">Bank Name:</label>
                                        <input
                                            type="text"
                                            id="b-name"
                                            name="bankName"
                                            value={vendorData.bankName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="a-name">Account Name:</label>
                                        <input
                                            type="text"
                                            id="a-name"
                                            name="accountName"
                                            value={vendorData.accountName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="a-number">Account Number:</label>
                                        <input
                                            type="text"
                                            id="a-number"
                                            name="accountNumber"
                                            value={vendorData.accountNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="p-number">Paybill Number:</label>
                                        <input
                                            type="text"
                                            id="p-number"
                                            name="payBillNumber"
                                            value={vendorData.payBillNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="t-number">Till Number:</label>
                                        <input
                                            type="text"
                                            id="t-number"
                                            name="tillNumber"
                                            value={vendorData.tillNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    </div>
                                    <input type="submit" className="edit-btn" value="edit vendor details" /> 
                                
                            </form>
                        </div>
                    )}
        </div>
      </div>
    </div>
  );
}

export default EditVendors;

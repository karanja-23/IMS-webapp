import SidebarComponent from "../components/sidebar";
import { useContext,useState } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import Notification from "../components/notification";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import "../CSS/addVendor.css"
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddVendor() {
    const navigate = useNavigate()
    const {isOpen} = useContext(AppContext)
    const [businessDetails, setBusinessDetails] = useState(true)
    const [address, setAddress] = useState(false)
    const [contactPerson, setContactPerson] = useState(false)
    const [paymentDetails, setPaymentDetails] = useState(false) 
    const [confirm, setConfirm] = useState(false)
    
    const initialVendorData = {
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
    };
    const [vendorData, setVendorData] = useState(initialVendorData);
    
    function handleReset() {
        setVendorData(initialVendorData);
    }
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setVendorData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };
    
    function handleSubmit(e){
        e.preventDefault();
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
        fetch('https://mobileimsbackend.onrender.com/vendors',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newVendor)       
        })
        .then(response => {
           
            return response.json()
        })
        .then(data => {
           
            if(data["message"] === "Vendor created successfully"){
                toast("Vendor created successfully",{
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
                
                setTimeout(() => {
                    navigate("/vendors")
                },1500);
                
            }
            else{
                toast("Vendor creation failed",{
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
            }
        })
    }

      
    return (
        <div className="main">           
        <SidebarComponent />
        <ToastContainer />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
        <div className="header" style={{width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',transition: '0.3s'}}>
                <div className="title">                
                    <h3>add new vendor</h3>
                    
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
            <div className="add-vendor">
                <div className="vendor-form">
                   <div className="menu">
                        <span onClick={() =>{
                            setConfirm(false)
                            setPaymentDetails(false)
                            setContactPerson(false)
                            setAddress(false)
                            setBusinessDetails(true)
                        }} style={{backgroundColor: businessDetails ? '#FC4F11' : '#07013A'}}>Business Details</span>
                        <span onClick={() =>{
                            setBusinessDetails(false)
                            setContactPerson(false)
                            setPaymentDetails(false)
                            setConfirm(false)
                            setAddress(true)
                        }} style={{backgroundColor: address ? '#FC4F11' : '#07013A' }}>Address</span>
                        <span onClick={() => {
                            setBusinessDetails(false)
                            setAddress(false)
                            setPaymentDetails(false)
                            setConfirm(false)
                            setContactPerson(true)
                        }} style={{backgroundColor: contactPerson ? '#FC4F11' : '#07013A'}}>Contact person</span>
                        <span onClick={()=>{
                            setBusinessDetails(false)
                            setAddress(false)
                            setPaymentDetails(true)
                            setConfirm(false)  
                            setContactPerson(false)                          
                        }} style={{backgroundColor: paymentDetails ? '#FC4F11' : '#07013A'}}>Payment details</span>
                        <span onClick={() =>{
                            setBusinessDetails(false)
                            setAddress(false)
                            setPaymentDetails(false)
                            setConfirm(true)  
                            setContactPerson(false) 
                        }} style={{backgroundColor: confirm ? '#FC4F11' : '#07013A' }}>Confirm</span>
                        
                   </div>
                </div>
                
            </div>
            <div className="container">
                    
                        <div className="business-details" style={{display: businessDetails ? 'block' : 'none'}}>
                            <label htmlFor="name">Name</label>
                            <input value={vendorData.businessName} onChange={handleInputChange} id="businessName" type="text" placeholder="Enter business name"  required/>
                            <label htmlFor="email" >Email</label>
                            <input value={vendorData.businessEmail} onChange={handleInputChange} id="businessEmail" type="email" placeholder="enter business email address" required/>
                            <label htmlFor="contact">Phone number</label>
                            <input value={vendorData.businessPhone} onChange={handleInputChange} id="businessPhone" type="tel" placeholder="enter busuness phone number" required/>
                            <label htmlFor="pin">KRA pin</label>
                            <input value={vendorData.kraPin} onChange={handleInputChange} id="kraPin" type="text" placeholder="enter kra pin" />

                            <button onClick={() =>{
                                setBusinessDetails(false)
                                setAddress(true)
                            }} className="btn">Continue</button>
                        </div>    
                    
                    
                        <div className="business-details" style={{display: address ? 'block' : 'none'}}>
                        <div className="address-back" onClick={() => {
                            setAddress(false)
                            setBusinessDetails(true)
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="address">Address</label>
                        <input value={vendorData.businessAddress} onChange={handleInputChange} id="businessAddress" type="text" placeholder="Enter business address/location"  required/>
                        <label htmlFor="code" >Postal address</label>
                        <input value={vendorData.postalAddress} onChange={handleInputChange} id="postalAddress" type="text" placeholder="enter business postal address" required/>
                        <label htmlFor="city">City</label>
                        <input value={vendorData.city} onChange={handleInputChange} id="city" type="text" placeholder="enter city name" required/>
                        <label htmlFor="country">Country</label>
                        <input value={vendorData.country} onChange={handleInputChange} id="country" type="text" placeholder="enter country name" />

                        <button onClick={() =>{                            
                            setAddress(false)
                            setContactPerson(true)
                        }} className="btn">Continue</button>
                    </div>                         
                   
                   
                        <div className="business-details" style={{display: contactPerson ? 'block' : 'none'}}>
                        <div className="address-back" onClick={() => {
                            setContactPerson(false)
                            setAddress(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="name">Name</label>
                        <input value={vendorData.contactName} onChange={handleInputChange} id="contactName" type="text" placeholder="Enter contact person's name"  required/>
                        <label htmlFor="email" >Email</label>
                        <input value={vendorData.contactEmail} onChange={handleInputChange} id="contactEmail" type="email" placeholder="enter contact person's email address" required/>
                        <label htmlFor="contact">Phone number</label>
                        <input value={vendorData.contactPhone} onChange={handleInputChange} id="contactPhone" type="text" placeholder="enter contact person's phone number" required/>

                        <button onClick={() =>{                            
                            setContactPerson(false)
                            setPaymentDetails(true)
                        }} className="btn">Continue</button>
                    </div>                         
                            
                    
                        <div className="business-details" style={{display: paymentDetails ? 'block' : 'none'}}>
                        <div className="address-back" onClick={() => {
                            setPaymentDetails(false)
                            setContactPerson(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="name">Bank name</label>
                        <input value={vendorData.bankName} onChange={handleInputChange} id="bankName" type="text" placeholder="Enter bank name"  required/>
                        <label htmlFor="account-number" >Account Number</label>
                        <input value={vendorData.accountNumber} onChange={handleInputChange} id="accountNumber" type="text" placeholder="Enter account number" required/>
                        <label htmlFor="account-name">Account name</label>
                        <input value={vendorData.accountName} onChange={handleInputChange} id="accountName" type="text" placeholder="Enter account name" required/>
                        <label htmlFor="paybill">Paybill number</label>
                        <input value={vendorData.payBillNumber} onChange={handleInputChange} id="payBillNumber" type="text" placeholder="Enter Mpesa paybill number" />
                        <label htmlFor="till">Till number</label>
                        <input value={vendorData.tillNumber} onChange={handleInputChange} id="tillNumber" type="text" placeholder="Enter Mpesa till number" />

                        <button onClick={() =>{                          
                            setPaymentDetails(false)
                            setConfirm(true)
                        }} className="btn">Continue</button>
                    </div>                         
                        
                   
                        <div className="business-details" style={{display: confirm ? 'block' : 'none'}}>
                        <div className="address-back" onClick={() => {
                            setConfirm(false)
                           setPaymentDetails(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <div className="confirm">
                            <span className="titles">Business details</span>
                            <span><strong>Business name:</strong> {vendorData.businessName}</span>
                            <span><strong>Business email:</strong> {vendorData.businessEmail}</span>
                            <span><strong>Business phone number:</strong> {vendorData.businessPhone}</span>
                            <span><strong>KRA pin:</strong> {vendorData.kraPin}</span>

                            <span className="titles">Adress details</span>
                            <span><strong>Physical address:</strong>{vendorData.businessAddress}</span>
                            <span><strong>Postal address:</strong> {vendorData.postalAddress}</span>
                            <span><strong>City:</strong> {vendorData.city}</span>
                            <span><strong>Country:</strong> {vendorData.country}</span>

                            <span className="titles">Contact person details</span>
                            <span><strong>Name:</strong> {vendorData.contactName}</span>
                            <span><strong>Email:</strong> {vendorData.contactEmail}</span>
                            <span><strong>Phone number:</strong> {vendorData.contactPhone}</span>

                            <span className="titles">Payment details</span>
                            <span><strong>Bank name:</strong> {vendorData.bankName}</span>
                            <span><strong>Account name:</strong>{vendorData.accountName}</span>
                            <span><strong>Account number:</strong>{vendorData.accountNumber}</span>
                            <span><strong>Paybill number:</strong>{vendorData.payBillNumber}</span>
                            <span><strong>Till number:</strong>{vendorData.tillNumber}</span>

                        </div>

                        <div className="buttons">                            
                            <button onClick={() =>{
                                setConfirm(false)
                                handleReset()
                                setBusinessDetails(true)
                            }} >Cancel</button>
                            <button onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>                         
                                                    
                </div>            
           
        </div>
    </div>
    );
}

export default AddVendor;
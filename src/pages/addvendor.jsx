import SidebarComponent from "../components/sidebar";
import { useContext,useState } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import Notification from "../components/notification";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import "../CSS/addVendor.css"

function AddVendor() {
    const {isOpen} = useContext(AppContext)
    const [businessDetails, setBusinessDetails] = useState(true)
    const [address, setAddress] = useState(false)
    const [contactPerson, setContactPerson] = useState(false)
    const [paymentDetails, setPaymentDetails] = useState(false) 
    const [confirm, setConfirm] = useState(false)
    
    
    return (
        <div className="main">           
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header">
                <div className="title">                
                    <h3>add new vendor</h3>
                    
                </div>
               <Notification />

            </div>
            <div className="back-button " onClick={() => window.history.back()} >
                <ArrowBackIosRoundedIcon style={{marginRight: '10px', fontSize: '1.3rem'}}/>
                <span style={{fontSize: '0.97rem'}} >back</span>
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
                    {businessDetails ? (
                        <div className="business-details">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" placeholder="Enter business name"  required/>
                            <label htmlFor="email" >Email</label>
                            <input id="email" type="email" placeholder="enter business email address" required/>
                            <label htmlFor="contact">Phone number</label>
                            <input id="contact" type="tel" placeholder="enter busuness phone number" required/>
                            <label htmlFor="pin">KRA pin</label>
                            <input id="pin" type="text" placeholder="enter kra pin" />

                            <button onClick={() =>{
                                setBusinessDetails(false)
                                setAddress(true)
                            }} className="btn">Continue</button>
                        </div>    
                    ) : null }
                    {address ? (
                        <div className="business-details">
                        <div className="address-back" onClick={() => {
                            setAddress(false)
                            setBusinessDetails(true)
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="address">Address</label>
                        <input id="address" type="text" placeholder="Enter business address/location"  required/>
                        <label htmlFor="code" >Postal address</label>
                        <input id="code" type="text" placeholder="enter business postal address" required/>
                        <label htmlFor="city">City</label>
                        <input id="city" type="text" placeholder="enter city name" required/>
                        <label htmlFor="country">Country</label>
                        <input id="country" type="text" placeholder="enter country name" />

                        <button onClick={() =>{                            
                            setAddress(false)
                            setContactPerson(true)
                        }} className="btn">Continue</button>
                    </div>                         
                    ) : null }
                    {contactPerson ? (
                        <div className="business-details">
                        <div className="address-back" onClick={() => {
                            setContactPerson(false)
                            setAddress(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" placeholder="Enter contact person's name"  required/>
                        <label htmlFor="email" >Email</label>
                        <input id="email" type="email" placeholder="enter contact person's email address" required/>
                        <label htmlFor="contact">Phone number</label>
                        <input id="contact" type="text" placeholder="enter contact person's phone number" required/>

                        <button onClick={() =>{                            
                            setContactPerson(false)
                            setPaymentDetails(true)
                        }} className="btn">Continue</button>
                    </div>                         
                    ) : null }         
                    {paymentDetails ? (
                        <div className="business-details">
                        <div className="address-back" onClick={() => {
                            setPaymentDetails(false)
                            setContactPerson(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <label htmlFor="name">Bank name</label>
                        <input id="name" type="text" placeholder="Enter bank name"  required/>
                        <label htmlFor="account-number" >Account Number</label>
                        <input id="account-number" type="text" placeholder="Enter account number" required/>
                        <label htmlFor="account-name">Account name</label>
                        <input id="account-name" type="text" placeholder="Enter account name" required/>
                        <label htmlFor="paybill">Paybill number</label>
                        <input id="paybill" type="text" placeholder="Enter Mpesa paybill number" />
                        <label htmlFor="till">Till number</label>
                        <input id="till" type="text" placeholder="Enter Mpesa till number" />

                        <button onClick={() =>{                          
                            setPaymentDetails(false)
                            setConfirm(true)
                        }} className="btn">Continue</button>
                    </div>                         
                    ) : null }     
                    {confirm ? (
                        <div className="business-details">
                        <div className="address-back" onClick={() => {
                            setConfirm(false)
                           setPaymentDetails(true)                            
                        }}>
                            <ArrowBackRoundedIcon />
                        </div>
                        <div>

                            
                        </div>

                        <button onClick={() =>{                            
                            setContactPerson(false)
                            setPaymentDetails(true)
                        }} className="btn">Continue</button>
                    </div>                         
                    ) : null }                                      
                </div>            
           
        </div>
    </div>
    );
}

export default AddVendor;
import "../CSS/login.css"
import  logo from "../assets/logo.png"
import { useState, useEffect, useContext } from "react";
import {AppContext} from "../context/context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";  
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {setUser,setAccessToken,accessToken, user,setLoggedIn,setTeam,setRoles} = useContext(AppContext);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        setIsLoading(true);
     
        if (email !== "" && password !== "") {
            fetch("https://mobileimsbackend.onrender.com/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  password: password,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        toast(data.error, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            className: "toast-message",
                            bodyClassName: "toast-message-body",
                        });
                        setIsLoading(false);
                        return;
                    }
                    if (data.access_token) {
                        if (checked) {                            
                         localStorage.setItem("token", data.access_token);
                         setAccessToken(data.access_token);
                         fetch(`https://mobileimsbackend.onrender.com/protected/user`, {
                            method: "GET",
                            headers: {
                              Authorization: `Bearer ${data.access_token}`,
                              "Content-Type": "application/json",
                            },
                          })
                            .then((response) => response.json())
                            .then((data) => {
                              if (data) {
                                setUser(data);  
                                getRoles();
                                setLoggedIn(true);
                            
                              }
                            })
                            .then(() => {
                              
                                fetch ('https://mobileimsbackend.onrender.com/users',{
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${data.access_token}`
                                    }
                                })
                                .then((response) => response.json())
                                .then((data) => {
                                    
                                    if (data) {
                                        setTeam(data);
                                        localStorage.setItem("team", JSON.stringify(data));
                                    }
                                })
                            })
                            .then(() => {
                                setTimeout(() => {
                                    setIsLoading(false);
                                    navigate("/");
                                }, 1000); 
                            })
                        
                        }
                        else {
                            setAccessToken(data.access_token);
                          
                            fetch(`https://mobileimsbackend.onrender.com/protected/user`, {
                                method: "GET",
                                headers: {
                                  Authorization: `Bearer ${data.access_token}`,
                                  "Content-Type": "application/json",
                                },
                              })
                                .then((response) => response.json())
                                .then((data) => {
                                  
                                  if (data) {
                                    setUser(data);  
                                    setLoggedIn(true);
                                                                       
                                  }
                                }) 
                                .then(() => {
                                    fetch ('https://mobileimsbackend.onrender.com/users',{
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${data.access_token}`
                                        }
                                    })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data) {
                                            setTeam(data);
                                            localStorage.setItem("team", JSON.stringify(data));
                                        }
                                    })
                                })
                                .then(() => {
                                    getRoles();                                  
                                    setTimeout(() => {                                        
                                        setIsLoading(false);
                                        navigate("/");
                                    }, 1000);
                                })
         
                        }
                    }

                })        
        }
        else {
            setIsLoading(false)
            toast("Please enter your email and password",{
                position: "top-center",
                autoClose: 5000,
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
    }
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }
    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }
    async function getRoles(){
        fetch('https://mobileimsbackend.onrender.com/roles/all',{
          method: 'GET',
         
        })
        .then(response => response.json())
        .then(data => {
          setRoles(data)
        })
      }

    return (
        <div className="login">
            
            <div className="image">

            </div>
            <ToastContainer />
            <div className="form">
                <img src={logo} style={{color: "white"}} alt="logo"/>
                <h2>Welcome back to Moringa School IMS</h2>
                <form id="form">
                    <h4 id="inst">Please enter your email and password:</h4>
                    <label for="email">Email</label>
                    <input id="email" onChange={(event) => handleEmailChange(event)} type="email" placeholder="johndoe@gmail.com" />
                    <label for="password">Password</label>
                    <input id="password" onChange={(event) => handlePasswordChange(event)} type="password" placeholder="johndoe@123" />
                    <div style={{display: "flex", width: "100%", alignItems: "left", paddingLeft: "17%"}}>
                    <input style={{marginRight: "10px", width: "15px", height: "15px"}} onChange={(event) => setChecked(event.target.checked)} checked = {checked} type="checkbox" id="remember" name="remember" />
                    <label style={{marginLeft: "5px", fontSize: "14px", fontWeight: "500"}} for="remember">Remember me</label>
                    </div>
                    <button onClick={(event) => {handleLogin(event)}} type="submit">
                        {isLoading ? (
                            <FontAwesomeIcon icon={faSpinner} spin size="lg" color="#fffss" />
                        ): "Login"} 
                    </button>

                </form>

            </div>
            
        </div>
    );
}

export default Login;
import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { use } from "react";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { ToastContainer, toast } from "react-toastify";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Notification from "../components/notification";
function Spaces() {
    const LIMIT = 5
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen,team, setTeam, roles, setRoles} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [addSpace, setAddSpace] = useState(false)
    const [name, setName] = useState('')
    const [newName, setNewName] = useState('')
    const [location, setLocation] = useState('')
    const [newLocation, setNewLocation] = useState('')
    const [description, setDescription] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [roleId, setRoleId] = useState('')
    const [newRoleId, setNewRoleId] = useState('')
    const [editSpace, setEditSpace] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [search, setSearch] = useState("")
    const [actionRowId, setActionRowId] =useState(null)
    const key = 'Composed Table'
    const [currentPage, setCurrentPage] = useState(0)
    const [currentSpaceId, setCurrentSpaceId] = useState(null)
    const [spaces,setSpaces] = useState([])
    const theme = useTheme(getTheme())
    const filteredData = spaces.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredData.length / LIMIT);
    const paginatedData = filteredData.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);
    


    useEffect(() => {
      if (loggedIn) {
        
        setTeam(JSON.parse(localStorage.getItem("team")))
        navigate("/spaces");
      }   
      else {
        const token = localStorage.getItem("token");

        if (token){
            setAccessToken(token)
            fetch(`https://mobileimsbackend.onrender.com/protected/user`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data['msg'] === 'Token has expired') {
                    localStorage.removeItem("token");
                    setAccessToken("");
                    setLoggedIn(false);
                    navigate("/login");
                  }
                  if (data) {
                    setUser(data);  
                    setLoggedIn(true);
                    setIsLoading(false)                            
                  }
                })
                .then(() => {
                    if (spaces.length === 0){
                      getSpaces()
                    }
                })
               
            }
            else{
                navigate("/login")
            }      
      }
      
    }, [loggedIn]);
    useEffect(() => {
        const currentSpaces = localStorage.getItem("spaces")
        if (currentSpaces){
            setSpaces(JSON.parse(currentSpaces))
        }        
        getSpaces()
    },[])
    async function getSpaces(){
        fetch('https://mobileimsbackend.onrender.com/spaces/all',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            
            localStorage.removeItem("spaces")
            localStorage.setItem("spaces", JSON.stringify(data));
            setSpaces(data)
            
        })
    }
    

 

    function addNewSpace(event){
      event.preventDefault()
      if (name ==="" || location ==="" ||description ==="" ){
        toast("Please enter all the details",{
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
      else{
        const newSpace = {
          name: name,
          location: location,
          description: description,         
        }
       
        fetch('https://mobileimsbackend.onrender.com/spaces',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSpace)
        })
        .then((response) => response.json())
        .then((data) =>{
          if (data["message"] = "Space created successfully"){
            toast("Space added succesfully",{
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
        .then(()=>{
          getSpaces()
          setTimeout(() => {
            setAddSpace(false)
          }, 2000);
        })
      }
      event.target.reset()
      setName("")
      setLocation("")
      setDescription("")

    }
    function handleSearch(event){
      setSearch(event.target.value)
      setCurrentPage(0)
    }
    function showEditSpace(id){
      setCurrentSpaceId(id)
      fetch(`https://mobileimsbackend.onrender.com/spaces/${id}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (data){
          setNewName(data.name)
          setNewLocation(data.location)
          setNewDescription(data.description)
          setNewStatus(data.status)
     
        }
      })
      .then(()=>{
        setActionRowId(null)
        setEditSpace(true)
      })
    }
    function handleEditSpace(event){
      
      event.preventDefault()
      const editSpace   = {
        name: newName,
        location: newLocation,
        description: newDescription,
        status: newStatus
      }
      
      fetch(`https://mobileimsbackend.onrender.com/spaces/${currentSpaceId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editSpace)

      })
      .then((response) => response.json())
      .then((data) => {
        if (data["status"]){
          toast("User updated successfully",{
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
      .then(()=>{
        getSpaces()
        setTimeout(() => {
          setEditSpace(false)
          setNewName("")
          setNewLocation("")
          setNewDescription("")
          setNewStatus("")
        }, 2000);
        
      })
    }
    function handleDeleteUser(id){
      fetch(`https://mobileimsbackend.onrender.com/spaces/${id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((data) => {
        
        if (data['message'] === "Space deleted"){
          setTimeout(() => {
            toast.success("Space deleted successfully",{
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
          },100);  
          })
        }
      })
      .then(()=>{
        getSpaces()
        setActionRowId(null)
      })
    }
    return (
      <>
    <div className="main" style={{opacity: addSpace ? 0.4 : 0.99}}> 
               
        <SidebarComponent />
        <ToastContainer />   
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s',}} >
        
        <div className="header" style={{width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',transition: '0.3s'}}>
                <div className="title">                   
                    <h2>Spaces</h2>
                    
                </div>
                <Notification />
            </div>

            <div style={{display: 'flex', marginLeft:'10%',flexDirection:'column' ,maxWidth:'80%',opacity: '0.8', paddingTop: '70px'}}> 

              <div style={{display: 'flex', alignItems: 'center' ,margin: "50px 0px 40px 10px", justifyContent: 'space-between'}}>
              <input
                type="search"
                placeholder="search ..."
                value={search}
                onChange={handleSearch}
                style={{
                  width: '25%',
                  padding: '7px 12px',
                  opacity: '0.9',
                  outline: 'none',
                  border: '1px solid #ccc', 
                  borderRadius: '5px', 
                  backgroundColor: '#f5f5f5',
                  fontSize: '14px',
                  transition: 'all 0.3s ease-in-out'
              }}
              >
              
              </input>
              <div onClick={()=> {
                setAddSpace(true)
              }} style={{display:'flex', cursor: 'pointer',justifyItems:'center', alignItems:'center',gap: '3px',backgroundColor:'#FC4F11', color:'white', padding:"5px 8px", fontWeight:'600', opacity:'0.9', borderRadius: "3px"}}>
                <ControlPointRoundedIcon />
                add new space

              </div>
              </div>
              
              <Table data={{nodes:paginatedData}} theme={theme} className="table">
                
                {
                  (tableList) =>(
                    <>
                      <Header>
                        <HeaderRow>
                          <HeaderCell>Name</HeaderCell>
                          <HeaderCell>Description</HeaderCell>
                          <HeaderCell>Location</HeaderCell>
                          <HeaderCell>status</HeaderCell>
                          <HeaderCell>action</HeaderCell>
                        </HeaderRow>
                      </Header>

                      <Body>
                       {tableList.map((item) =>(
                        <Row key={item.id} item={item}>
                          <Cell>{item.name}</Cell>
                          <Cell>{item.description}</Cell>
                          <Cell>{item.location}</Cell>
                          <Cell>{item.status}</Cell>
                          <Cell>
                            <MoreVertRoundedIcon onClick={((event) => {
                              event.stopPropagation()
                              setActionRowId(actionRowId === item.id ? null : item.id);
                            }

                              )} />
                            {actionRowId === item.id ? (
                              <div className="action-modal">
                                  <span onClick={(() => navigate(`/fixedAssets/${item.name}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                                  <span onClick={() => showEditSpace(item.id)} >
                                    <EditRoundedIcon  style={{fontSize: "1.3em"}} />
                                    edit space
                                  </span>
                                  <span onClick={() => handleDeleteUser(item.id)}>
                                    <DeleteRoundedIcon style={{fontSize: "1.3em"}} />
                                    delete space
                                  </span>
                              </div>
                            ) : null}
                           </Cell>
                        </Row>
                       ))}

                        
                      </Body>
                    </>
                  )
                }
              </Table>            
              <div className="pagination">
              <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </div>
            </div>
        </div>

    </div>
    {addSpace ? (
          <div className="add_user_modal">
            <ToastContainer />
            <h3 style={{opacity:"0.75"}}>Add new space</h3>
            <CloseRoundedIcon onClick={()=> setAddSpace(false)}  className="close-btn" />
            <form onSubmit={addNewSpace}>
              <label htmlFor="name" >Name</label>
              <input id="name" onChange={(event) => setName(event.target.value)} value={name} type="text" placeholder="Name" />
              <label htmlFor="location">Location</label>
              <input id="location" onChange={(event) => setLocation(event.target.value)} value={location} type="text" placeholder="Location" />
              <label htmlFor="description">Description</label>
              <input id="description" onChange={(event) => setDescription(event.target.value)} value={description} type="text" placeholder="Description" />
             
              <input className="button" type="submit" value="Submit" />
            </form>
          </div>        
        ) : null}
            {editSpace ? (
          <div className="add_user_modal">
            <ToastContainer />
            <h3 style={{opacity:"0.75"}}>Edit space</h3>
            <CloseRoundedIcon onClick={()=> setEditSpace(false)}  className="close-btn" />
            <form onSubmit={handleEditSpace}>
              <label htmlFor="name" >Name</label>
              <input id="name" onChange={(event) => setNewName(event.target.value)} value={newName} type="text" placeholder="Name" />
              <label htmlFor="location">Email</label>
              <input id="location" onChange={(event) => setNewLocation(event.target.value)} value={newLocation} type="text" placeholder="Location" />
              <label htmlFor="description">Contact</label>
              <input id="description" onChange={(event) => setNewDescription(event.target.value)} value={newDescription} type="text" placeholder="Description" />
              <label htmlFor="status">Status</label>
              <input id="status" onChange={(event) => setNewStatus(event.target.value)} value={newStatus} type="text" placeholder="Status" />
              
              <input className="button" type="submit" value="Submit" />
            </form>
          </div>        
        ) : null}
    </>
    )
}
export default Spaces


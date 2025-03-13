import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { use } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import "../CSS/team.css"
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
function Team() {
    const LIMIT = 7
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen,team, setTeam} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [addUser, setAddUser] = useState(false)
    const [roles, setRoles] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [password, setPassword] = useState('')
    const [roleId, setRoleId] = useState('')
    const [search, setSearch] = useState("")
    const [actionRowId, setActionRowId] =useState(null)
    const key = 'Composed Table'
    const [currentPage, setCurrentPage] = useState(0)
    
    const theme = useTheme(getTheme())
    const filteredData = team.filter((item) => item.username.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredData.length / LIMIT);
    const paginatedData = filteredData.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);
  


    useEffect(() => {
      if (loggedIn) {
     
        navigate("/team");
      }   
      else {
        const token = localStorage.getItem("token");

        if (token){
            setAccessToken(token)
            fetch(`http://172.236.2.18:5000/users/protected/user`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    setUser(data);  
                    setLoggedIn(true);
                    setIsLoading(false)                            
                  }
                })
                .then(()=>{
                  if(team.length > 0){
                    return
                  }
                  const storedTeam = localStorage.getItem("team")

                  if (storedTeam){
                    setTeam(JSON.parse(storedTeam))
                  }
                  else{
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
                          localStorage.setItem("team", JSON.stringify(data))
                      }
                  })
                  }
                })
            }
            else{
                navigate("/login")
            }      
      }
      
    }, [loggedIn]);

    async function getRoles(){
      fetch('https://mobileimsbackend.onrender.com/roles/all',{
        method: 'GET',
       
      })
      .then(response => response.json())
      .then(data => {
        setRoles(data)
      })
    }

    function addNewUser(event){
      event.preventDefault()
      if (user ==="" || email ==="" ||contact ==="" || password==="" || Number(roleId) === 0){
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
        const newUser = {
          username: name,
          email: email,
          contact: contact,
          password: password,
          role_id: Number(roleId)
        }
        console.log(newUser)
        fetch('https://mobileimsbackend.onrender.com/users',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })
        .then((response) => response.json())
        .then((data) =>{
          if (data["message"] = "User created successfully"){
            toast("User added succesfully",{
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
          fetch ('https://mobileimsbackend.onrender.com/users',{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data) {
              
                setTeam(data);
                localStorage.setItem("team", JSON.stringify(data))
                setAddUser(false)
                
            }
        })          
        })
      }
      event.target.reset()

    }
    function handleSearch(event){
      setSearch(event.target.value)
      setCurrentPage(0)
    }
    return (
      <>
    <div className="main" style={{opacity: addUser ? 0.4 : 0.99}}> 
        <ToastContainer />          
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s',}} >
        
            <div className="header">
                <div className="title">
                    <WorkspacesRoundedIcon style={{marginRight: '10px'}}/>
                    <h2>Team</h2>
                    
                </div>
                <div className="notification">
                    <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
                    
                </div>

            </div>

            <div style={{display: 'flex', marginLeft:'5%',flexDirection:'column' ,maxWidth:'90%',opacity: '0.8'}}> 

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
                getRoles()
                setAddUser(true)
              }} style={{display:'flex', cursor: 'pointer',justifyItems:'center', alignItems:'center',gap: '3px',backgroundColor:'#FC4F11', color:'white', padding:"5px 8px", fontWeight:'600', opacity:'0.9', borderRadius: "3px"}}>
                <ControlPointRoundedIcon />
                add new user

              </div>
              </div>
              
              <Table data={{nodes:paginatedData}} theme={theme} className="table">
                
                {
                  (tableList) =>(
                    <>
                      <Header>
                        <HeaderRow>
                          <HeaderCell>Name</HeaderCell>
                          <HeaderCell>Email</HeaderCell>
                          <HeaderCell>Contact</HeaderCell>
                          <HeaderCell>Role</HeaderCell>
                          <HeaderCell>action</HeaderCell>
                        </HeaderRow>
                      </Header>

                      <Body>
                       {tableList.map((item) =>(
                        <Row key={item.id} item={item}>
                          <Cell>{item.username}</Cell>
                          <Cell>{item.email}</Cell>
                          <Cell>{item.contact}</Cell>
                          <Cell>{item.role['name']}</Cell>
                          <Cell>
                            <MoreVertRoundedIcon onClick={((event) => {
                              event.stopPropagation()
                              setActionRowId(actionRowId === item.id ? null : item.id);
                            }

                              )} />
                            {actionRowId === item.id ? (
                              <div className="action-modal">
                                  <span >
                                    <EditRoundedIcon style={{fontSize: "1.3em"}} />
                                    edit user
                                  </span>
                                  <span>
                                    <DeleteRoundedIcon style={{fontSize: "1.3em"}} />
                                    delete
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
    {addUser ? (
          <div className="add_user_modal">
            <ToastContainer />
            <h3 style={{opacity:"0.75"}}>Add new user</h3>
            <CloseRoundedIcon onClick={()=> setAddUser(false)}  className="close-btn" />
            <form onSubmit={addNewUser}>
              <label for="name" >Name</label>
              <input id="name" onChange={(event) => setName(event.target.value)} value={name} type="text" placeholder="Name" />
              <label for="email">Email</label>
              <input id="email" onChange={(event) => setEmail(event.target.value)} value={email} type="email" placeholder="Email" />
              <label for="contact">Contact</label>
              <input id="contact" onChange={(event) => setContact(event.target.value)} value={contact} type="text" placeholder="Contact" />
              <label for="password">Password</label>
              <input id="password" onChange={(event) => setPassword(event.target.value)} value={password} type="password" placeholder="Password" />
              <select style={{alignSelf:'flex-start'}} onChange={(event) => setRoleId(event.target.value)}>
                <option value={0}>Select role</option>
                {roles.map((role) => (
                  <option value={role.id}>{role.name}</option>
                ))}
              </select>
              <input className="button" type="submit" value="Submit" />
            </form>
          </div>        
        ) : null}
    </>
    )
}
export default Team
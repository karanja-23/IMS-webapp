import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { use } from "react";
import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';
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
function Requests() {
    const LIMIT = 5
    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen,team, setTeam, roles, setRoles,requests, setRequests} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [addSpace, setAddSpace] = useState(false)
    const [assignModal, setAssignModal] = useState(false)
    const [borrower, setBorrower] = useState("")
    const [assetName, setAssetName] = useState("")
    const [currentAssetId, setCurrentAssetId] = useState("")
    const [borrowerId, setBorrowerId] = useState("")
    const [requestId, setRequestId] = useState("")
    const [search, setSearch] = useState("")
    const [spaces, setSpaces] =useState([])
    const [spaceId, setSpaceId] = useState("")
    
    const [actionRowId, setActionRowId] =useState(null)
    const key = 'Composed Table'
    const [currentPage, setCurrentPage] = useState(0)

    
    const theme = useTheme(getTheme())
    const filteredData = (requests || []).filter((item) => item.asset.name.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredData.length / LIMIT);
    const paginatedData = filteredData.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);
    


    useEffect(() => {
      if (loggedIn) {        
        setRequests(JSON.parse(localStorage.getItem("requests")))
        navigate("/requests");
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
                    if (requests.length === 0){
                      getRequests()
                    }
                })
               
            }
            else{
                navigate("/login")
            }      
      }
      
    }, [loggedIn]);
    useEffect(() => {
        getSpaces()
                
        getRequests()

    },[])
    async function getSpaces(){
        fetch("https://mobileimsbackend.onrender.com/spaces/all", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
                setSpaces(data)
            });
      }
    async function getRequests(){
        fetch('https://mobileimsbackend.onrender.com/requests',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            
            localStorage.removeItem("requests")
            localStorage.setItem("requests", JSON.stringify(data));
            setRequests(data)
            
        })
    }
    

    function handleSearch(event){
      setSearch(event.target.value)
      setCurrentPage(0)
    }
    function showAssignModal(id, name, userId,asset_name,thisId){
        setActionRowId(null)
        setAssignModal(true)
        setCurrentAssetId(id)
        setBorrower(name)
        setBorrowerId(userId)
        setAssetName(asset_name)
        setRequestId(thisId)
    }
    function handleAssign(){
        fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({   
              assign_id: Number(borrowerId),
              space_id: Number(spaceId),
              status: "borrowed"
            })
          })
          .then((response) => response.json())
          .then((data) =>{
            if (data["message"] === "Asset updated") {
                
                fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}/history`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({   
                      assigned_to: Number(borrowerId),
                      space_id: Number(spaceId),
                      status: "borrowed"
                    })
            
                })
                .then((response => response.json()))
                .then((data) =>{
                    if (data["message"] === "Asset history added") {
                        fetch(`https://mobileimsbackend.onrender.com/requests/${requestId}`,{
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                              },
                            body: JSON.stringify({
                                "status": "approved"
                            })
                        })
                        .then(response => response.json())
                        .then((data) =>{
                            if(data.asset){
                                toast("asset assigned succesfully", {
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
                                  getRequests()
                                  setAssignModal(false)
                            }
                            else{
                                toast("error in assigning asset", {
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
                        })

                    }
                })
            }
            else{
                toast("error in assigning asset", {
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
                    <h2>Requests</h2>
                    
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
              
              </div>
              
              <Table data={{nodes:paginatedData}} theme={theme} className="table">
                
                {
                  (tableList) =>(
                    <>
                      <Header>
                        <HeaderRow>
                          <HeaderCell>Date</HeaderCell>
                          <HeaderCell>Serial Number</HeaderCell>
                          <HeaderCell>Asset Name</HeaderCell>
                          <HeaderCell>Requested by</HeaderCell>
                          <HeaderCell>Status</HeaderCell>
                          <HeaderCell>action</HeaderCell>
                        </HeaderRow>
                      </Header>

                      <Body>
                       {tableList.map((item) =>(
                        <Row key={item.id} item={item}>
                          <Cell>{new Date(item.date).toISOString().split('.')[0].replace('T', ' ')}</Cell>
                          <Cell>{item.asset['serial_number']}</Cell>
                          <Cell>{item.asset['name']}</Cell>
                          <Cell>{item.user['username']}</Cell>
                          <Cell>{item.status}</Cell>
                          <Cell>
                            <MoreVertRoundedIcon onClick={((event) => {
                              event.stopPropagation()
                              setActionRowId(actionRowId === item.id ? null : item.id);
                            }

                              )} />
                            {actionRowId === item.id ? (
                              <div className="action-modal">
                                <span className="action" onClick={() =>{showAssignModal(item.asset['id'],item.user['username'],item.user['id'],item.asset['name'],item.id)}}>
                                <CheckCircleOutlineRoundedIcon 
                                  style={{ fontSize: "1.3em" }}
                                />
                                approve
                              </span>
                              <span className="action1" style={{}} >
                                <DoNotDisturbRoundedIcon
                                  style={{ fontSize: "1.3em"}}
                                />
                                decline
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
    {assignModal ? (
        <div className="assign_asset_modal">
            <CloseRoundedIcon
              onClick={() => {
                setAssignModal(false);
                
              }}
              className="close-btn"
            />
            <h5 style={{letterSpacing:"0.7px"}}>Approving request for <span>{assetName}</span> from <span>{borrower}</span></h5>
            <select value={spaceId} onChange={(event) => setSpaceId(event.target.value)}>
            <option value={0}>Select space</option>
            {spaces?.map((space, index) => (
              <option value={space.id} key={index}>
                {space.name}
              </option>
            ))}
            </select>
            <button onClick={handleAssign} >Approve</button>

        </div>
    ) : null}

    </>
    )
}
export default Requests


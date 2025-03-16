import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../CSS/team.css";

function Orders() {
  const LIMIT = 7;
  const navigate = useNavigate();
  const {
    loggedIn,
    setLoggedIn,
    accessToken,
    setAccessToken,
    isOpen,
    team,
    setTeam,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addUser, setAddUser] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [actionRowId, setActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const theme = useTheme(getTheme());

  const filteredData = team.filter((item) =>
    item.assetName?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (!loggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        setAccessToken(token);
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
              setLoggedIn(true);
              setIsLoading(false);
              setTeam(JSON.parse(localStorage.getItem("fixedAssets")) || []);
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);

  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }

  function addNewUser(event){
    event.preventDefault()
    if (email ==="" ||contact ==="" || password===""){
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

  return (
    <>
    <div className="main" style={{ opacity: 0.99 }}>
      <SidebarComponent />
      <ToastContainer />
      <div
        className="content"
        style={{
          width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
          left: isOpen ? 202 : 62,
          transition: "0.3s",
        }}
      >
        <div className="header">
          <div className="title">
            <WorkspacesRoundedIcon style={{ marginRight: "10px" }} />
            <h2>Orders</h2>
          </div>
          <div className="notification">
            <CircleNotificationsRoundedIcon
              style={{ marginRight: "10px", fontSize: "1.9rem" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginLeft: "5%",
            flexDirection: "column",
            maxWidth: "90%",
            opacity: "0.8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "50px 0px 40px 10px",
              justifyContent: "space-between",
            }}
          >
            <input
              type="search"
              placeholder="Search assets..."
              value={search}
              onChange={handleSearch}
              style={{
                width: "25%",
                padding: "7px 12px",
                opacity: "0.9",
                outline: "none",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
                fontSize: "14px",
              }}
            />
            <div
              onClick={() => {
                setAddUser(true);
              }}
              style={{
                display: "flex",
                cursor: "pointer",
                justifyItems: "center",
                alignItems: "center",
                gap: "3px",
                backgroundColor: "#FC4F11",
                color: "white",
                padding: "5px 8px",
                fontWeight: "600",
                opacity: "0.9",
                borderRadius: "3px",
              }}
            >
              <ControlPointRoundedIcon />
              Add New Order
            </div>
          </div>

          <Table
            data={{ nodes: paginatedData }}
            theme={theme}
            className="table"
          >
            {(tableList) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Order Id</HeaderCell>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Date</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell>Action</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((item) => (
                    <Row key={item.id} item={item}>
                      <Cell>{item.assetName}</Cell>
                      <Cell>{item.category}</Cell>
                      <Cell>{item.value}</Cell>
                      <Cell>{item.location}</Cell>
                      <Cell>
                        <MoreVertRoundedIcon
                          onClick={(event) => {
                            event.stopPropagation();
                            setActionRowId(
                              actionRowId === item.id ? null : item.id
                            );
                          }}
                        />
                        {actionRowId === item.id && (
                          <div className="action-modal">
                            <span>
                              <EditRoundedIcon style={{ fontSize: "1.3em" }} />{" "}
                              Edit
                            </span>
                            <span>
                              <DeleteRoundedIcon
                                style={{ fontSize: "1.3em" }}
                              />{" "}
                              Delete
                            </span>
                          </div>
                        )}
                      </Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </div>
    </div>
    {addUser ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{opacity:"0.75"}}>Add New Order</h3>
          <CloseRoundedIcon onClick={()=> setAddUser(false)}  className="close-btn" />
          <form onSubmit={addNewUser}>
            <label for="name" >Order Name</label>
            <input id="name" onChange={(event) => setName(event.target.value)} value={name} type="text" placeholder="Name" />
            <label for="date">Date</label>
            <input id="date" onChange={(event) => setContact(event.target.value)} value={contact} type="date" placeholder="Value" />
            <label for="status">Select Status</label>
            <select name="" id="status">
                <option value="0">Select Status</option>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
            </select>
            <input className="button" type="submit" value="Submit" />
          </form>
        </div>        
      ) : null}
      </>
  );
}

export default Orders;

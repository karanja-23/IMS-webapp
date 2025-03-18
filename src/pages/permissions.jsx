import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import "../CSS/team.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Notification from "../components/notification";

function Permissions() {
  const LIMIT = 5;
  const navigate = useNavigate();
  const {
    loggedIn,
    setLoggedIn,
    user,
    setUser,
    accessToken,
    setAccessToken,
    isOpen,
    team,
    setTeam,
    roles,
    setRoles,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [addUser, setAddUser] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentPage, setCurrentPage] = useState(0);
  const [roleName, setRoleName] = useState("");
  const theme = useTheme(getTheme());
  const filteredData = roles.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionInputs, setPermissionInputs] = useState([]);
  const [editPermission, setEditPermission] = useState(false);
  useEffect(() => {
    if (loggedIn) {
      getPermissions();
      navigate("/permissions");
    } else {
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
              setUser(data);
              setLoggedIn(true);
              setIsLoading(false);
            }
          })
          .then(() => {
            if (roles.length > 0) {
              return;
            }
            const myRoles = localStorage.getItem("roles");
            if (myRoles) {
              setRoles(JSON.parse(myRoles));
            }
            getPermissions();
            getRoles();
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);
  useEffect(() => {
    if (roles.length > 0) {
      return;
    }
    const myRoles = localStorage.getItem("roles");
    if (myRoles) {
      setRoles(JSON.parse(myRoles));
    }
    getPermissions();
    getRoles();
  },[])
  async function getPermissions() {
    fetch("https://mobileimsbackend.onrender.com/permissions/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPermissions(data);
      });
  }
  async function getRoles() {
    fetch("https://mobileimsbackend.onrender.com/roles/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        
        setRoles(data); 
        localStorage.removeItem("roles");
        localStorage.setItem("roles", JSON.stringify(data));      
      })


  }
  
  function addRole(event) {
    event.preventDefault();
    fetch("https://mobileimsbackend.onrender.com/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roleName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        if (data["name"]) {
          toast("Role added successfully", {
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
          fetch("https://mobileimsbackend.onrender.com/role_permission", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              role_id: data.id,
              permission_ids: selectedPermissions,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              
            });
        }
      })

      .then(() => {
       setTimeout(() => {
        getRoles();
       }, 1000);
    
      })
      .then(() => {
        toast("Role added successfully", {
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
        setAddUser(false);
        setRoleName("");
      });
    event.target.reset();
  }
  function handlePermissionChange(event) {
    const { checked, value } = event.target;
    const permissionId = parseInt(value, 10); 

    setSelectedPermissions((prevPermissions) => {
      const updatedPermissions = checked
        ? [...prevPermissions, permissionId] 
        : prevPermissions.filter((id) => id !== permissionId);

      
      return updatedPermissions;
    });
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  function handleDelete(id) {
    fetch(`https://mobileimsbackend.onrender.com/roles/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === "Role deleted") {
          toast("Role deleted successfully", {
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
      .then(() => {
        getRoles();
        setActionRowId(null);
      });
  }
  useEffect(() => {
    getPermissions();
    getRoles();
  }, []);

  function editRole(event) {
    getRoles();
    event.preventDefault();
    fetch("https://mobileimsbackend.onrender.com/role_permission", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role_id: roleId,
        permission_ids: selectedPermissions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
      
        setRoleId("");
        setSelectedPermissions([]);
        getRoles();
        setRoleName("");
        setActionRowId(null);
        setEditPermission(false);
        toast("Role updated successfully", {
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
      });
      event.target.reset();  
  }
  return (
    <>
    <div className="main" style={{opacity: addUser ? 0.4 : 0.99}}> 
               
               <SidebarComponent />
               <ToastContainer />   
               <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s',}} >
               
                   <div className="header">
                       <div className="title">
                          
                           <h2>Permissions</h2>
                           
                       </div>
                       <Notification />
       
                   </div>
       
                   <div style={{display: 'flex', marginLeft:'20%',flexDirection:'column' ,maxWidth:'60%',opacity: '0.8'}}> 
       
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
                       setAddUser(true)
                     }} style={{display:'flex', cursor: 'pointer',justifyItems:'center', alignItems:'center',gap: '3px',backgroundColor:'#FC4F11', color:'white', padding:"5px 8px", fontWeight:'600', opacity:'0.9', borderRadius: "3px"}}>
                       <ControlPointRoundedIcon />
                       add new Role
       
                     </div>
                     </div>
                     

            <Table
              data={{ nodes: paginatedData }}
              theme={theme}
              className="table"
              style={{ width: "100%", display: "flex", boxSizing: "border-box" }}
            >
              {(tableList) => (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "12% 40% 48%",
                    width: "100%",
                  }}
                >
                  <Header>
                    <HeaderRow style={{ display: "contents" }}>
                      <HeaderCell>No.</HeaderCell>
                      <HeaderCell>Role</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row
                        key={item.id}
                        item={item}
                        style={{ display: "contents" }}
                      >
                        <Cell>{currentPage * LIMIT + index + 1}</Cell>

                        <Cell>{item.name}</Cell>

                        <Cell>
                          <MoreVertRoundedIcon
                            onClick={(event) => {
                              event.stopPropagation();
                              setActionRowId(
                                actionRowId === item.id ? null : item.id
                              );
                            }}
                          />
                          {actionRowId === item.id ? (
                            <div
                              className="action-modal"
                              style={{ width: "fit-content", zIndex: "9999" }}
                            >
                              <span
                                onClick={() => {
                                  setRoleName(item.name);
                                  setRoleId(item.id);
                                  
                                  setSelectedPermissions(
                                    item.permissions.map((perm) => perm.id)
                                  );

                                  setEditPermission(true);
                                }}
                              >
                                <EditRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                edit permissions
                              </span>
                              <span onClick={() => handleDelete(item.id)}>
                                <DeleteRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                delete role
                              </span>
                            </div>
                          ) : null}
                        </Cell>
                      </Row>
                    ))}
                  </Body>
                </div>
              )}
            </Table>
            <div className="pagination">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {addUser ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Add new Role</h3>
          <CloseRoundedIcon
            onClick={() => setAddUser(false)}
            className="close-btn"
          />
          <form onSubmit={addRole}>
            <label for="name">Name</label>
            <input
              id="name"
              onChange={(event) => setRoleName(event.target.value)}
              value={roleName}
              type="text"
              placeholder="Name"
            />
            <h4 style={{ marginBottom: "10px" }}>Add Permissions</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "8px",
                maxWidth: "400px",
              }}
            >
              {permissions.map((permission) => (
                <div
                  key={permission.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    gap: "10px",
                  }}
                >
                  <input
                    id={permission.name}
                    type="checkbox"
                    value={permission.id}
                    onChange={handlePermissionChange}
                    checked={selectedPermissions.includes(permission.id)}
                    style={{ width: "13px", height: "13px", marginTop: "10px" }}
                  />
                  <label
                    htmlFor={permission.name}
                    style={{ fontSize: "14x", fontWeight: "500", flex: 1 }}
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
      {editPermission ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Edit Role</h3>
          <CloseRoundedIcon
            onClick={() => {
              setEditPermission(false);
              setActionRowId(null);
              setRoleName("");
              setRoleId("");
              setSelectedPermissions([]);
            }}
            className="close-btn"
          />
          <form onSubmit={editRole}>
            <label for="name">Name</label>
            <input
              id="name"
              onChange={(event) => setRoleName(event.target.value)}
              value={roleName}
              type="text"
              placeholder="Name"
            />
            <h4 style={{ marginBottom: "10px" }}>Add Permissions</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "8px",
                maxWidth: "400px",
              }}
            >
              {permissions.map((permission) => (
                <div
                  key={permission.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    gap: "10px",
                  }}
                >
                  <input
                    id={permission.name}
                    type="checkbox"
                    value={permission.id}
                    onChange={handlePermissionChange}
                    checked={selectedPermissions.includes(permission.id)}
                    style={{ width: "13px", height: "13px", marginTop: "10px" }}
                  />
                  <label
                    htmlFor={permission.name}
                    style={{ fontSize: "14x", fontWeight: "500", flex: 1 }}
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
    </>
  );
}
export default Permissions;

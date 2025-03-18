import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import "../CSS/team.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
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

function Team() {
  const LIMIT = 7;
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
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [contact, setContact] = useState("");
  const [newContact, setNewContact] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [editUser, setEditUser] = useState(false);
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const theme = useTheme(getTheme());
  const filteredData = team?.filter((item) =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData?.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      const storedTeam = localStorage.getItem("team");
      if (storedTeam) {
        setTeam(JSON.parse(storedTeam));
        navigate("/team");
      } else {
        fetch("https://mobileimsbackend.onrender.com/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setTeam(data);
            localStorage.setItem("team", JSON.stringify(data));
            navigate("/team");
          });
      }
    } else {
      const token = localStorage.getItem("token");

      if (token) {
        setAccessToken(token);
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
              setIsLoading(false);
            }
          })
          .then(() => {
            if (roles.length > 0) {
              return;
            }
            getRoles();
          })
          .then(() => {
            if (team.length > 0) {
              return;
            }

            const storedTeam = localStorage.getItem("team");

            if (storedTeam) {
              setTeam(JSON.parse(storedTeam));
            } else {
              fetch("https://mobileimsbackend.onrender.com/users", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.access_token}`,
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    setTeam(data);
                    localStorage.removeItem("team");
                    localStorage.setItem("team", JSON.stringify(data));
                  }
                });
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);


  async function getRoles() {
    fetch("https://mobileimsbackend.onrender.com/roles/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      });
  }

  function addNewUser(event) {
    event.preventDefault();
    if (
      user === "" ||
      email === "" ||
      contact === "" ||
      password === "" ||
      Number(roleId) === 0
    ) {
      toast("Please enter all the details", {
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
    } else {
      const newUser = {
        username: name,
        email: email,
        contact: contact,
        password: password,
        role_id: Number(roleId),
      };
      
      fetch("https://mobileimsbackend.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          if ((data["message"] = "User created successfully")) {
            toast("User added succesfully", {
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
          fetch("https://mobileimsbackend.onrender.com/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                setTeam(data);
                localStorage.removeItem("team");
                localStorage.setItem("team", JSON.stringify(data));
                setAddUser(false);
              }
            });
        });
    }
    event.target.reset();
  }
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  function showEditUser(id) {
    setCurrentUserId(id);
    fetch(`https://mobileimsbackend.onrender.com/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setNewName(data.username);
          setNewEmail(data.email);
          setNewContact(data.contact);
          setNewPassword(data.password);
          setNewRoleId(data.role_id);
        }
      })
      .then(() => {
        setActionRowId(null);
        setEditUser(true);
      });
  }
  function handleEditUser(event) {
    event.preventDefault();
    const editUser = {
      username: newName,
      email: newEmail,
      contact: newContact,
      password: newPassword,
      role_id: Number(newRoleId),
    };
   
    fetch(`https://mobileimsbackend.onrender.com/users/${currentUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editUser),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["contact"]) {
          toast("User updated successfully", {
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
        fetch("https://mobileimsbackend.onrender.com/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setTeam(data);
              setEditUser(false);
            }
          });
      });
  }
  function handleDeleteUser(id) {
    fetch(`https://mobileimsbackend.onrender.com/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        
        if (data["message"] === "User deleted") {
          setTimeout(() => {
            toast.success(
              "User deleted successfully",
              {
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
              },
              100
            );
          });
        }
      })
      .then(() => {
        fetch("https://mobileimsbackend.onrender.com/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              localStorage.removeItem("team");
              localStorage.setItem("team", JSON.stringify(data));
              setTeam(data);
            }
          });
      });
  }
  return (
    <>
      <div className="main" style={{ opacity: addUser ? 0.4 : 0.99 }}>
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
          <div className="header">
            <div className="title">
              <h2>Users</h2>
            </div>
            <Notification />
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
                placeholder="search ..."
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
                  transition: "all 0.3s ease-in-out",
                }}
              ></input>
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
                add new user
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
                      <HeaderCell>Name</HeaderCell>
                      <HeaderCell>Email</HeaderCell>
                      <HeaderCell>Contact</HeaderCell>
                      <HeaderCell>Role</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.username}</Cell>
                        <Cell>{item.email}</Cell>
                        <Cell>{item.contact}</Cell>
                        <Cell>{item.role["name"]}</Cell>
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
                            <div className="action-modal">
                              <span onClick={(() => navigate(`/team/${item.username}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                              <span onClick={() => showEditUser(item.id)}>
                                <EditRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                edit
                              </span>
                              <span onClick={() => handleDeleteUser(item.id)}>
                                <DeleteRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                delete
                              </span>
                            </div>
                          ) : null}
                        </Cell>
                      </Row>
                    ))}
                  </Body>
                </>
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
          <h3 style={{ opacity: "0.75" }}>Add new user</h3>
          <CloseRoundedIcon
            onClick={() => setAddUser(false)}
            className="close-btn"
          />
          <form onSubmit={addNewUser}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="Name"
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              type="email"
              placeholder="Email"
            />
            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              onChange={(event) => setContact(event.target.value)}
              value={contact}
              type="text"
              placeholder="Contact"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              type="password"
              placeholder="Password"
            />
            <select
              style={{ alignSelf: "flex-start" }}
              onChange={(event) => setRoleId(event.target.value)}
            >
              <option value={0}>Select role</option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
              ))}
            </select>
            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
      {editUser ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Edit user</h3>
          <CloseRoundedIcon
            onClick={() => setEditUser(false)}
            className="close-btn"
          />
          <form onSubmit={handleEditUser}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setNewName(event.target.value)}
              value={newName}
              type="text"
              placeholder="Name"
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              onChange={(event) => setNewEmail(event.target.value)}
              value={newEmail}
              type="email"
              placeholder="Email"
            />
            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              onChange={(event) => setNewContact(event.target.value)}
              value={newContact}
              type="text"
              placeholder="Contact"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              onChange={(event) => setNewPassword(event.target.value)}
              value={newPassword}
              type="password"
              placeholder="Password"
            />
            <select
              style={{ alignSelf: "flex-start" }}
              onChange={(event) => setNewRoleId(event.target.value)}
            >
              <option value={0}>Select role</option>
              {roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
              ))}
            </select>
            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
    </>
  );
}
export default Team;

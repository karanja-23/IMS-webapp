import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import { use } from "react";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";

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
function Inventory() {
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
    spaces,
    setSpaces,
    inventories,
    setInventories,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [addInventory, setAddInventory] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("")
  const [cost, setCost] = useState("")
  const [search, setSearch] = useState("");
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSpaceId, setCurrentSpaceId] = useState(null);
  const theme = useTheme(getTheme());
  const filteredData = (inventories || []).filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      setInventories(JSON.parse(localStorage.getItem("inventories")));
      navigate("/inventory");
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
            if (data["msg"] === "Token has expired") {
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
            if (inventories.length === 0) {
              getInventories();
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);
  useEffect(() => {
    getInventoryCategories();
    const currentInventories = localStorage.getItem("inventories");
    if (currentInventories) {
      setInventories(JSON.parse(currentInventories));
    } else {
      getInventories();
    }
  }, []);

  function getInventories() {
    fetch("https://mobileimsbackend.onrender.com/inventory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventories(data);
        localStorage.removeItem("inventories");
        localStorage.setItem("inventories", JSON.stringify(data));
      });
  }

  function addNewSpace(event) {
    event.preventDefault();
    if (name === "" || location === "" || description === "") {
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
      const newSpace = {
        name: name,
        location: location,
        description: description,
      };

      fetch("https://mobileimsbackend.onrender.com/spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSpace),
      })
        .then((response) => response.json())
        .then((data) => {
          if ((data["message"] = "Space created successfully")) {
            toast("Space added succesfully", {
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
          getSpaces();
          setTimeout(() => {
            setAddInventory(false);
          }, 2000);
        });
    }
    event.target.reset();
    setName("");
    setLocation("");
    setDescription("");
  }
  async function getInventoryCategories() {
    fetch("https://mobileimsbackend.onrender.com/inventory/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventoryCategories(data);
      });
  }
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }

  return (
    <>
      <div className="main" style={{ opacity: addInventory ? 0.4 : 0.99 }}>
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
              <h2>Inventory</h2>
            </div>
            <Notification />
          </div>

          <div
            style={{
              display: "flex",
              marginLeft: "10%",
              flexDirection: "column",
              maxWidth: "80%",
              opacity: "0.8",
              paddingTop: "70px",
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
                  setAddInventory(true);
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
                add new Inventory
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
                      <HeaderCell>Item Name</HeaderCell>
                      <HeaderCell>Category</HeaderCell>
                      <HeaderCell>Quantity</HeaderCell>
                      <HeaderCell>Unit cost</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.name}</Cell>
                        <Cell>{item.category["name"]}</Cell>
                        <Cell>{item.quantity}</Cell>
                        <Cell>{item.unit_cost}</Cell>
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
                              <span
                                onClick={() =>
                                  navigate(`/spaces/view/${item.name}`, {
                                    state: { id: item.id },
                                  })
                                }
                              >
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view all
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
      {addInventory ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Add new space</h3>
          <CloseRoundedIcon
            onClick={() => setAddInventory(false)}
            className="close-btn"
          />
          <form onSubmit={addNewSpace}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="Name"
            />
            <label htmlFor="category"></label>
            <select id="category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} >
                <option value={0}>Select category </option>
                {inventoryCategories ? (
                    inventoryCategories.map((category, index) =>(
                        <option value={category.id} key={index}>{category.name}</option>
                    ))
                ): null}
            </select>
            <label htmlFor="cost">Cost</label>
            <input
              id="cost"
              onChange={(event) => setCost(event.target.value)}
              value={cost}
              type="text"
              placeholder="Location"
            />
            

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
     
    </>
  );
}
export default Inventory;

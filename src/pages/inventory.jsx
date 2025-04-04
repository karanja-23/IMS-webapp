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
import Loading from "../components/loading";
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
  const [loadingInventoryDetails,setLoadingInventoryDetails] = useState(false)
  const [addInventory, setAddInventory] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("")
  const [cost, setCost] = useState("")
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false)
  const [quantity, setQuantity] =useState("")
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [actionRowId, setActionRowId] = useState(null);
  const [currentInventory, setCurrentInventory] = useState([])
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
        const   inventoriesInAlphabeticalOrder = JSON.parse(localStorage.getItem("inventories")).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          
      setInventories(inventoriesInAlphabeticalOrder);
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
    getInventories();
    
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
        const inventoriesInAlphabeticalOrder = data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          
      setInventories(inventoriesInAlphabeticalOrder);
        localStorage.removeItem("inventories");
        localStorage.setItem("inventories", JSON.stringify(data));
      });
  }

  function addNewInventory(event){
    event.preventDefault()
    const newInventory = {
        name: name,
        category_id: categoryId,
        unit_cost: cost
    }
    console.log(newInventory)
    fetch('https://mobileimsbackend.onrender.com/inventory',{
        method: 'POST',
        headers :{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newInventory) 
    })
    .then(response => response.json())
    .then((data) => {
       
        if (data.message === "Inventory created successfully"){
            toast("Inventory created successfully", {
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
            getInventories() 
            setAddInventory(false)            
            clearStates()
        }
        else{
            toast("Failed to create inventory", {
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
  function showEditModal(id){
    setActionRowId(null)
    setLoadingInventoryDetails(true)
    fetch(`https://mobileimsbackend.onrender.com/inventory/${id}`,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then((data) =>{
        setCurrentInventory(data)
        setName(data.name)
        setCategoryId(data.category['id'])
        setCost(data.unit_cost)
        setQuantity(data.quantity)
    })
    .then(() =>{
        setLoadingInventoryDetails(false)
        setEdit(true)
    })
  }
  function handleEdit(event){
    event.preventDefault()
    const editedInventory = {
        name: name,
        category_id: categoryId,
        quantity: quantity,
        unit_cost: cost
    }
    fetch(`https://mobileimsbackend.onrender.com/inventory/${currentInventory.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedInventory)
    })
    .then(response => response.json()) 
    .then((data) =>{
        if (data.name){
            toast("Inventory updated successfully", {
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
            getInventories()
            setEdit(false)
            clearStates()
        }
        else{
            toast("Error in updating inventory", {
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
            setEdit(false)
        }
    })
  }
  function clearStates(){
    setName("")
    setCategoryId("")
    setCost("")
    setQuantity("")
    
  }
  return (
    <>
      <div className="main" style={{ opacity: addInventory || edit || loadingInventoryDetails ? 0.4 : 0.99 }}>
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
          {loadingInventoryDetails? <Loading />: null}  
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
                      <HeaderCell>Inventory Name</HeaderCell>
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
                        <Cell>Ksh. {item.unit_cost.toLocaleString()}</Cell>
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
                                  navigate(`/inventory/${item.name}`, {
                                    state: { id: item.id },
                                  })
                                }
                              >
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view items
                              </span>
                              <span onClick={() => showEditModal(item.id)}>
                                <EditRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                edit
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
          <h3 style={{ opacity: "0.75" }}>Add new inventory</h3>
          <CloseRoundedIcon
            onClick={() => setAddInventory(false)}
            className="close-btn"
          />
          <form onSubmit={addNewInventory}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="Enter inventory name"
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
            <label htmlFor="cost">Unit cost</label>
            <input
              id="cost"
              onChange={(event) => setCost(event.target.value)}
              value={cost}
              type="number"
              placeholder="Enter cost of inventory per unit"
            />
            

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
      {edit ? (
        <div className="add_user_modal">
        <ToastContainer />
        <h3 style={{ opacity: "0.75" }}>edit new inventory</h3>
        <CloseRoundedIcon
          onClick={() => {            
            setEdit(false)
          }}
          className="close-btn"
        />
        <form onSubmit={handleEdit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="Enter inventory name"
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
            <label htmlFor="cost">Unit cost</label>
            <input
              id="cost"
              onChange={(event) => setCost(event.target.value)}
              value={cost}
              type="number"
              placeholder="Enter cost of inventory per unit"
            />
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              onChange={(event) => setQuantity(event.target.value)}
              value={quantity}
              type="number"
              placeholder="Enter cost of inventory per unit"
            />
            

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
     
    </>
  );
}
export default Inventory;

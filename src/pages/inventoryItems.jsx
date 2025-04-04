import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Loading from "../components/loading";
import image from "../assets/space.png";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import "../CSS/users.css";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Notification from "../components/notification";
import { ToastContainer, toast } from "react-toastify";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import pluralize from "pluralize";
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
function InventoryItems() {
  const LIMIT = 5;
  const { isOpen } = useContext(AppContext);
  const { name } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [vendorId, setVendorId] = useState("")
  const id = location.state?.id;
  const  [categories, setCategories] = useState([])
  const [serialNumber, setSerialNumber] = useState("")
  const [inventory, setInventory] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [date, setDate] = useState("")
  const [cost, setCost] = useState("")
  const [quantity, setQuantity] = useState("")
  const [spaces, setSpaces] =useState([])
  const [vendors, setVendors] =useState([])
  const [description, setDescription] =useState([])
  const [categoryId, setCategoryId] = useState("")
  const [spaceId, setSpaceId] = useState([])
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("")
  const [currentPage, setCurrentPage] = useState(0);
  const [actionRowId, setActionRowId] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const filteredData = inventoryItems
  ?.filter((item) =>
    item?.serial_number?.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.serial_number.localeCompare(b.serial_number));
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );
  
  const theme = useTheme(getTheme());

  useEffect(() => {
    getInventories()
    getVendors()
    getSpaces()
    getInventoryCategories()
  }, []);
  async function getInventoryCategories() {
    fetch("https://mobileimsbackend.onrender.com/inventory/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }
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
  function getInventories() {
    fetch(`https://mobileimsbackend.onrender.com/inventory/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setInventory(data)
        setInventoryItems(data.inventory_items);
        setLoading(false)
      });
  }
  async function getVendors(){
    fetch("https://mobileimsbackend.onrender.com/vendors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
            setVendors(data)
        });
  }
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  function addNewItem(){
    setShowAddItemModal(true)

  }
  function handleAddInventoryItem(event){
    event.preventDefault()
    const newInventoryItem = {
        inventory_id : inventory.id,
        serial_number: serialNumber,
        description: description,
        date_acquired: date,
        condition: condition,
        quantity:Number(quantity),
        vendor_id: Number(vendorId),
        unit_cost: cost,
        space_id: Number(spaceId)
    }
    console.log(newInventoryItem)
    fetch('https://mobileimsbackend.onrender.com/inventory/items',{
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newInventoryItem)
    })
    .then(response => response.json())
    .then((data) =>{
        if (data.message === "Inventory item created successfully"){
            toast("Inventory item created successfully", {
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
              getInventories()
              updateInventoryItemNumber()
              setTimeout(() =>{
                setShowAddItemModal(false)
              },2500)
        }
        else{
            toast("Faoled to create inventory item!", {
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
  console.log(inventory.id)
  function updateInventoryItemNumber(){
    fetch(`https://mobileimsbackend.onrender.com//update/quantity/${inventory.id}`,{
        method: 'PUT'
    })    
    .then(response => response.json())
    .then((data) => {
        console.log(data)
    })
    
  }
  return (
    <div className="main">
      <SidebarComponent />

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
            {loading ? null : <h3>Inventory / {inventory.name}</h3>}
          </div>
          <Notification />
        </div>
        <div className="back-button-container ">
          <div className="back-button " onClick={() => window.history.back()}>
            <ArrowBackIosRoundedIcon
              style={{ marginRight: "10px", fontSize: "1.3rem" }}
            />
            <span style={{ fontSize: "0.97rem" }}>back</span>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
           
            <div
            style={{
              display: "flex",
              marginLeft: "5%",
              flexDirection: "column",
              maxWidth: "90%",
              opacity: "0.8",
              marginTop: "40px",              
              
            }}
          >
            <h3 style={{color:'var(--blue)', textAlign:'left', marginTop:"-10px", opacity:"0.8"}}>Inventory items</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom:"20px",
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
                 addNewItem()
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
                add new item
              </div>
            </div>
              <Table
              data={{ nodes: paginatedData }}
              theme={theme}
              className="tables"
              style={{paddingBottom:"40px"}}
            >
                {(tableList) => (
                <>
                  <Header>
                    <HeaderRow>
                        <HeaderCell >Serial Number</HeaderCell>
                      <HeaderCell>Inventory Type</HeaderCell>
                      <HeaderCell>Quantity</HeaderCell>
                      <HeaderCell >Status</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                      
                      
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={index} item={item}>
                        <Cell>{item.serial_number}</Cell>
                        <Cell>{item.inventory['name']}</Cell>
                        <Cell>{item.quantity}</Cell>               
                        <Cell>{item.status}</Cell>
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
                                 <span onClick={(() => navigate(`/inventory/${item.inventory['name']}/${item.serial_number}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                                
                             </div>
                           ): null}
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
          </>
        )}
      </div>
      {showAddItemModal ? (
       <div className="add_asset_modal">
       <ToastContainer />
       <h3 style={{ opacity: "0.75" }}>Add a new {pluralize.singular(inventory.name || "item")}</h3>
       <CloseRoundedIcon
         onClick={() => {
             setShowAddItemModal(false)
             
         }}
         className="close-btn"
       />
       <form onSubmit={handleAddInventoryItem}>
         <div  className="form-container" style={{display: 'flex',gap:'40px'}}>
         <div className="form-groups">

         <label htmlFor="serial">Serial Number</label>
         <input
           id="serial"
           onChange={(event) => setSerialNumber(event.target.value)}
           value={serialNumber}
           type="text"
           placeholder="enter item serial number"
         />
         <label htmlFor="category">Category</label>
         <select value={categoryId} id="category" onChange={(event)=>setCategoryId(event.target.value)} >
             <option value={0}>Select item's category</option>
             {categories?.map((category, index) => (
                 <option key={index} value={category.id}>{category.name}</option>

             ))}
         </select>
         <label htmlFor="condition">Item Condition</label>
         <input
           id="condition"
           onChange={(event) => setCondition(event.target.value)}
           value={condition}
           type="text"
           placeholder="enter item's condition"
         />
         <label htmlFor="quantity">Quantity</label>
         <input
           id="quantity"
           onChange={(event) => setQuantity(event.target.value)}
           value={quantity}
           type="text"
           placeholder="enter item quantity"
         />

         </div>

         <div className="form-groups">
         <label htmlFor="cost">Purchase cost</label>
         <input
           id="cost"
           onChange={(event) => setCost(event.target.value)}
           value={cost}
           type="number"
           placeholder="enter item's cost"
         />
         <label htmlFor="date">Date acquired</label>
         <input
           id="date"
           onChange={(event) => setDate(event.target.value)}
           value={date}
           type="date"
         />
         <label htmlFor="space">Current Location</label>
         <select value={spaceId} id="space" onChange={(event)=>setSpaceId(event.target.value)}>
             <option value={0}>Select space</option>
             {spaces?.map((space,index) =>(
                 <option value={space.id} key={index}>{space.name}</option>
             )) }
         </select>

         <label htmlFor="vendors">Select item's Vendor</label>
         <select value={vendorId} id="vendors" onChange={(event) => setVendorId(event.target.value)}>
             <option value={0}>Select vendor</option>
             {vendors?.map((vendor,index) =>(
                 <option value={vendor.id} key={index}>{vendor.name}</option>
             )) }
         </select>

         </div>
                     
         </div>
         
         <label htmlFor="description">Description</label>
         <textarea
           id="description"
           className="desc"
           onChange={(event) => setDescription(event.target.value)}
           value={description}
           placeholder="Enter item description..."
           rows={4}
           style={{
             width: "100%",
             minHeight: "100px",
             resize: "vertical",
             padding: "10px",
             borderRadius: "5px",
             border: "1px solid #ccc",
             fontSize: "16px",
           }}
         ></textarea>

         <input className="button" type="submit" style={{width: '60%'}} value="Submit" />
       </form>
       
     </div>
      ) : null}
    </div>
  );
}
export default InventoryItems;

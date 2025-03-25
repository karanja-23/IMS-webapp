import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import { useNavigate } from "react-router-dom";
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "../CSS/assets.css"
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
function FixedAssets() {
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
  const [addasset, setAddAsset] = useState(false);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [serialNumber, setSerialNumber] = useState('')
  const [newLocation, setNewLocation] = useState("");
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [editAsset, setEditAsset] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentPage, setCurrentPage] = useState(0);
  const [currentAssetId, setCurrentAssetId] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [vendors, setVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [assets, setAssets] = useState([]);
  const [spaceId, setSpaceId] =useState('')
  const [vendorId, setVendorId] =useState('')
  const [categoryId,setCategoryId] =useState('')
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);

  const theme = useTheme(getTheme());
  const filteredData = assets?.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      setAssets(JSON.parse(localStorage.getItem("assets")));
      setCategories(JSON.parse(localStorage.getItem("categories")));
      navigate("/fixedAssets");
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
            if (assets.length === 0) {
              getAssets();
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);
  useEffect(() => {
    Promise.all([getAssets(), getCategories(), getSpaces(), getVendors(),getUsers()]);
  }, []);
  async function getAssets() {
    fetch("https://mobileimsbackend.onrender.com/assets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        
        const assetsInAlphabeticalOrder = data.sort((a, b) =>
          a.serial_number.localeCompare(b.serial_number)
        );
        setAssets(assetsInAlphabeticalOrder);
        localStorage.removeItem("assets");
        localStorage.setItem("assets", JSON.stringify(assetsInAlphabeticalOrder));
      });
  }
  async function getCategories(){
    fetch("https://mobileimsbackend.onrender.com/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          
          localStorage.removeItem("categories");
          localStorage.setItem("categories", JSON.stringify(data));
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
  async function getUsers(){
    fetch('https://mobileimsbackend.onrender.com/users',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }        
    })
    .then(response => response.json())
    .then(data => {
        setUsers(data)
    })

  }
  function addNewAsset(event) {
    event.preventDefault();
    if (name === "" || serialNumber  === "" || description === "" || cost==='' || categories === 0) {
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
      const newAsset = {
        name: name,
        purchase_date:date,
        purchase_cost:cost,
        description:description,
        serial_number: serialNumber,
        space_id:Number(spaceId),
        vendor_id:Number(vendorId),
        category_id:Number(categoryId)     

      };
      fetch('http://127.0.0.1:5000/assets',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAsset)

      })
      .then(response => response.json())
      .then((body) =>{
        if (body['message'] === "Fixed asset created successfully"){
            toast("Asset created successfully",{
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
            getAssets()
            setTimeout(()=>{
                setAddAsset(false)
            },2000)
        }
      })
   
    }
    event.target.reset()
    resetState()
  
  }
  function resetState(){
    setName('')
    setDate('')
    setCost('')
    setDescription('')
    setSerialNumber('')
    setSpaceId('')
    setVendorId('')
    setCategoryId('')
  }
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  function showEditAsset(id) {
    setCurrentAssetId(id);
    fetch(`https://mobileimsbackend.onrender.com/assets/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
            const formattedDate = new Date(data.purchase_date).toISOString().split("T")[0]

            setName(data.name)
            setDate(formattedDate)
            setCost(data.purchase_cost)
            setDescription(data.description)
            setSerialNumber(data.serial_number)
            setSpaceId(data.space.id)
            setVendorId(data.vendor.id)
            setCategoryId(data.category.id)
            
        }
      })
      .then(() => {
        setActionRowId(null);
        setEditAsset(true);
        
      });
  }
  function handleEditAsset(event) {
    event.preventDefault();
    const editAsset = {
        name: name,
        purchase_date:date,
        purchase_cost:cost,
        description:description,
        serial_number: serialNumber,
        space_id:Number(spaceId),
        vendor_id:Number(vendorId),
        category_id:Number(categoryId)     

      };

    fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editAsset),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === 'Asset updated') {
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
        getAssets();
        setTimeout(() => {
          setEditAsset(false);
          resetState()
        }, 2000);
      });
  }
  function handleDeleteAsset(id) {
    fetch(`https://mobileimsbackend.onrender.com/assets/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === "Asset deleted") {
            toast("Asset deleted succesfully", {
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
      .then(() => {
        getAssets();
        setActionRowId(null);
      });
  }
  function showAssignAsset(id,status){
    setCurrentAssetId(id)
    if (status === "unassigned"){
      setShowAssignModal(true)
    }
    else{
      toast("Asset already assigned", {
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
  function handleAssignAsset(){
    
    fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({   
        assign_id: Number(userId),
        space_id: Number(spaceId),
        status: "borrowed"
      })
    })
    .then((response) => response.json())
    .then((data) => {
      if (data["message"] === "Asset updated") {
        toast("Asset assigned successfully", {
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
        getAssets()
        setShowAssignUserModal(false)
      }
    })
    .then(() => {
      fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({   
          assigned_to: Number(userId),
          space_id: Number(spaceId),
          status: "borrowed"
        })

      })
      
    })
  }

  return (
    <>
      <div className="main" style={{ opacity: addasset ? 0.4 : 0.99 }}>
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
              <h2>Fixed Assets</h2>
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
                  setAddAsset(true);
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
                add new asset
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
                      <HeaderCell>Serial Number</HeaderCell>
                      <HeaderCell>Asset Name</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Current Location</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.serial_number}</Cell>
                        <Cell>{item.name}</Cell>
                        <Cell>{item.status}</Cell>
                        <Cell>{item.space["name"]}</Cell>
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
                                <span onClick={() => showAssignAsset(item.id,item.status)}>
                                <AssignmentIndRoundedIcon 
                                  style={{ fontSize: "1.3em" }}
                                />
                                assign
                              </span>
                              <span onClick={(() => navigate(`/fixedAssets/${item.name}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                              <span onClick={() => showEditAsset(item.id)}>
                                <EditRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                edit
                              </span>
                              <span onClick={() => handleDeleteAsset(item.id)}>
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
      {addasset ? (
        <div className="add_user_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Add new fixed asset</h3>
          <CloseRoundedIcon
            onClick={() => setAddAsset(false)}
            className="close-btn"
          />
          <form onSubmit={addNewAsset}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="enter asset name"
            />
            <label htmlFor="category">Category</label>
            <select id="category" onChange={(event)=>setCategoryId(event.target.value)} >
                <option value={0}>Select asset category</option>
                {categories?.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>

                ))}
            </select>
            <label htmlFor="serial">Serial number</label>
            <input
              id="serial"
              onChange={(event) => setSerialNumber(event.target.value)}
              value={serialNumber}
              type="text"
              placeholder="enter serial number"
            />
            <label htmlFor="date">Purchase date</label>
            <input
              id="date"
              onChange={(event) => setDate(event.target.value)}
              value={date}
              type="date"
            />
            <label htmlFor="cost">Purchase cost</label>
            <input
              id="cost"
              onChange={(event) => setCost(event.target.value)}
              value={cost}
              type="number"
              placeholder="enter asset cost"
            />

            <label htmlFor="space">Current Location</label>
            <select id="space" onChange={(event)=>setSpaceId(event.target.value)}>
                <option value={0}>Select space</option>
                {spaces?.map((space,index) =>(
                    <option value={space.id} key={index}>{space.name}</option>
                )) }
            </select>
            <label htmlFor="vendors">Vendor</label>
            <select id="vendors" onChange={(event) => setVendorId(event.target.value)}>
                <option value={0}>Select vendor</option>
                {vendors?.map((vendor,index) =>(
                    <option value={vendor.id} key={index}>{vendor.name}</option>
                )) }
            </select>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="desc"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
              placeholder="Enter asset description..."
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

            <input className="button" type="submit" value="Submit" />
          </form>
        </div>
      ) : null}
      {editAsset ? (
        <div className="add_asset_modal">
          <ToastContainer />
          <h3 style={{ opacity: "0.75" }}>Edit Asset</h3>
          <CloseRoundedIcon
            onClick={() => {
                setEditAsset(false)
                resetState()
            }}
            className="close-btn"
          />
          <form onSubmit={handleEditAsset}>
            <div  className="form-container" style={{display: 'flex',gap:'40px'}}>
            <div className="form-groups">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              type="text"
              placeholder="enter asset name"
            />
            <label htmlFor="category">Category</label>
            <select value={categoryId} id="category" onChange={(event)=>setCategoryId(event.target.value)} >
                <option value={0}>Select asset category</option>
                {categories?.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>

                ))}
            </select>
            <label htmlFor="serial">Serial number</label>
            <input
              id="serial"
              onChange={(event) => setSerialNumber(event.target.value)}
              value={serialNumber}
              type="text"
              placeholder="enter serial number"
            />

            </div>

            <div className="form-groups">
            <label htmlFor="cost">Purchase cost</label>
            <input
              id="cost"
              onChange={(event) => setCost(event.target.value)}
              value={cost}
              type="number"
              placeholder="enter asset cost"
            />
            <label htmlFor="date">Purchase date</label>
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

            <label htmlFor="vendors">Select Vendor</label>
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
              placeholder="Enter asset description..."
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
      {showAssignModal ? (
        <>
          <div className="assign_asset_modal">
            <ToastContainer />
            <h3 style={{ opacity: "0.75" }}>Assign Asset</h3>
            <CloseRoundedIcon
              onClick={() => {
                setShowAssignModal(false);
              }}
              className="close-btn"
            />
            <button onClick={() =>{
               setShowAssignModal(false)
               setActionRowId(null)
               getUsers()
               setShowAssignUserModal(true)

            }}>Assign asset to a user</button>
            <button>Assign to space</button>
            
          </div>
        </>
      ) : null}
      {showAssignUserModal ? (
        <div className="assign_asset_modal">
          <h4>Assign asset to:</h4>
          <CloseRoundedIcon
              onClick={() => {
                setShowAssignUserModal(false);
              }}
              className="close-btn"
            />
          <label htmlFor="user">Select user</label>
          <select value={userId} onChange={(event) => setUserId(event.target.value)}>
            <option value={0}>Select user</option>
            {users?.map((user, index) => (
              <option value={user.id} key={index}>
                {user.username}
              </option>
            ))}
          </select>
          <label htmlFor="space">Select space</label>
          <select value={spaceId} onChange={(event) => setSpaceId(event.target.value)}>
            <option value={0}>Select space</option>
            {spaces?.map((space, index) => (
              <option value={space.id} key={index}>
                {space.name}
              </option>
            ))}
          </select>
          <button onClick={() => handleAssignAsset()}>Assign</button>

        </div>
      ): null}
    </>
  );
}
export default FixedAssets;

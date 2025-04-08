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
import "../CSS/returns.css"
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
import { AssignmentTurnedInRounded } from "@mui/icons-material";
import { c } from "@table-library/react-table-library/Feature-dc8674d3";
function Returns() {
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
    returns,
    setReturns
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAssetId, setCurrentAssetId] = useState(null);
  const [returnAsset, setReturnAsset] = useState(false);
  const [addasset, setAddAsset] = useState(false);
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentAssetName, setCurrentAssetName] = useState("");
  const [borrower, setBorrower] = useState("");
  const [borrowerId, setBorrowerId] = useState("")
  const [currentPage, setCurrentPage] = useState(0);
  const [spaceId, setSpaceId] = useState(null);
  const [spaces, setSpaces] = useState([]);
  
  const [showReturnModal, setShowReturnModal] = useState(false);
  const theme = useTheme(getTheme());
  const filteredData = (returns || []).filter((item) =>
    item.name? item.name : item.inventory['name'].toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData?.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      const assetsInAlphabeticalOrder = JSON.parse(localStorage.getItem("unassingnedassets")).sort((a, b) =>
        a.serial_number.localeCompare(b.serial_number)
      );
      setReturns(assetsInAlphabeticalOrder);
      console.log(assetsInAlphabeticalOrder)
     
      navigate("/returns");
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
            if (returns.length === 0) {
              getAssets();
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);
  useEffect(() => {
    getAssets();
  }, []);
  async function getAssets() {
    try {
      const [assetsResponse, inventories] = await Promise.all([
        fetch("https://mobileimsbackend.onrender.com/assets").then(res => res.json()),
        getInventories()
      ]);
  
      const allReturns = [...assetsResponse, ...inventories];
      const assignedAssets = allReturns.filter(asset => asset.status !== "unassigned");
  
      localStorage.removeItem("unassingnedassets");
      localStorage.setItem("unassingnedassets", JSON.stringify(assignedAssets));
  
      const assetsInAlphabeticalOrder = assignedAssets.sort((a, b) =>
        a.serial_number.localeCompare(b.serial_number)
      );
  
      setReturns(assetsInAlphabeticalOrder);
    } catch (error) {
      console.error("Error fetching assets or inventories:", error);
    }
  }
  
  async function getInventories() {
    try {
      const response = await fetch("https://mobileimsbackend.onrender.com/inventory/items", {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching inventories:", error);
      return [];
    }
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

  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }

function handleReturnModal(name, user, id){
  getSpaces()
  setCurrentAssetName(name)
  setBorrower(user)
  setBorrowerId(id)
  setShowReturnModal(!showReturnModal)
  
}
function handleReturn(id){
  setShowReturnModal(false)
  setActionRowId(null)
  setReturnAsset(true)
}
function handleReturnAsset(){
  if(spaceId !== '0'){
    fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assign_id: null,
        status: 'unassigned',
        space_id:spaceId
      })
    })
    .then(response => response.json())
    
    .then((body) =>{
      if (body['message'] === 'Asset updated'){
        getAssets()
        toast("Asset returned", {
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
        setReturnAsset(false)
      }
    })
    .then(() => {
      fetch(`https://mobileimsbackend.onrender.com/assets/${currentAssetId}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({   
          assigned_to: borrowerId,
          space_id: Number(spaceId),
          status: "returned"
        })

      })
      .then(response => response.json())
      .then ((body) =>{
        console.log(body)
      })
      
    })
  }
  else{
    toast("Please select a room", {
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
              <h2>Returns</h2>
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
                      <HeaderCell>Item Name</HeaderCell>
                      <HeaderCell>Type</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Current Location</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.serial_number}</Cell>
                        <Cell>{item.name ? item.name:item.inventory['name']}</Cell>
                        <Cell>{item.name? "fixed asset": "inventory"}</Cell>
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
                           
                              <span onClick={(() => navigate(`/returns/${item.name? item.name: `inventory_${item.serial_number}`}`,{state:{id:item.id,type:item.name? "fixed asset":"inventory"}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                              <span onClick={(() => {
                                handleReturnModal(item.name, item.assign['username'],item.assign['id'])
                                setCurrentAssetId(item.id)
                              })}>
                                < AssignmentIndRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                return
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
        {showReturnModal && (
          <div className="assign_asset_modal">
              <h4>Return <span>{currentAssetName}</span> assigned to <span>{borrower}</span></h4> 
              <button onClick={() => handleReturn(currentAssetId)}> Yes</button>
              <button onClick={() => {
                setShowReturnModal(false)
                setActionRowId(null)
              }}>No</button>
         
          </div>
        )}
        {returnAsset ?  (
          <div className="assign_asset_modal">
            <CloseRoundedIcon
              onClick={() => {
                setReturnAsset(false);
              }}
              className="close-btn"
            />
               
          <label htmlFor="space">Return to:</label>
          <select  id="space" value={spaceId} onChange={(event) => setSpaceId(event.target.value)}>
            <option value={0}>Select Space</option>
            {spaces?.map((space, index) => (
              <option value={space.id} key={index}>
                {space.name}
              </option>
            ))}
          </select>

          <button onClick={() => handleReturnAsset()}>Return</button>
          </div>
        ) : null}
      </div>
      
    </>
  );
}
export default Returns;

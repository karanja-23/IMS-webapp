import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Loading from "../components/loading";
import image from "../assets/space.png";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import "../CSS/users.css";
import Notification from "../components/notification";
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
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const id = location.state?.id;
  const [inventory, setInventory] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [actionRowId, setActionRowId] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
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
  }, []);
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
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
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
              marginTop: "40px"
              
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
                add new item
              </div>
            </div>
              <Table
              data={{ nodes: paginatedData }}
              theme={theme}
              className="tables"
            >
                {(tableList) => (
                <>
                  <Header>
                    <HeaderRow>
                        <HeaderCell >Serial Number</HeaderCell>
                      <HeaderCell>Inventory Type</HeaderCell>
                      <HeaderCell>Quantity</HeaderCell>
                      <HeaderCell >Status</HeaderCell>
                      
                      
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={index} item={item}>
                        <Cell>{item.serial_number}</Cell>
                        <Cell>{item.inventory['name']}</Cell>
                        <Cell>{item.quantity}</Cell>               
                        <Cell>{item.status}</Cell>
                        
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
    </div>
  );
}
export default InventoryItems;

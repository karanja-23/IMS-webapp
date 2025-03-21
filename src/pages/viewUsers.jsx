import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Loading from "../components/loading";
import image from "../assets/user.png";
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
function ViewUsers() {
  const LIMIT = 5;
  const { isOpen } = useContext(AppContext);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const id = location.state?.id;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [actionRowId, setActionRowId] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const filteredData = userHistory?.filter((item) =>
    item.assigned_to["username"].toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  const theme = useTheme(getTheme());

  useEffect(() => {
    fetch(`https://mobileimsbackend.onrender.com/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setCurrentUser(data);
          setUserHistory(data.history)
          setLoading(false);
        }
      });
  }, []);
  
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
            {loading ? null : <h3>Profile/{currentUser.username}</h3>}
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
            <div className="profiles">
              <div className="profile-img">
                <img style={{ maxWidth: "200px" }} src={image} alt="user" />
              </div>
              <div className="profile-details">
                <div>
                  <span>
                    <strong>Username:</strong> {currentUser.username}
                  </span>
                  <span>
                    <strong>Email:</strong> {currentUser.email}
                  </span>
                </div>
                <div>
                  <span>
                    <strong>Role:</strong> {currentUser.role.name}
                  </span>
                  <span>
                    <strong>Contact:</strong> {currentUser.contact}
                  </span>
                </div>
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
            <h3 style={{color:'var(--blue)', textAlign:'left', marginTop:"-10px", opacity:"0.8"}}>Asset history</h3>
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
                  marginBottom:'10px'
                }}
              ></input>
              <Table
              data={{ nodes: paginatedData }}
              theme={theme}
              className="tables"
            >
                {(tableList) => (
                <>
                  <Header>
                    <HeaderRow>
                      <HeaderCell>Date</HeaderCell>
                      <HeaderCell>Serial number</HeaderCell>
                      <HeaderCell >Asset name</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                      
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={index} item={item}>
                         <Cell>{item.date}</Cell>
                        <Cell>{item.asset['serial_number']}</Cell> 
                        <Cell>{item.asset['name']}</Cell>               
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
export default ViewUsers;

import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Loading from "../components/loading";
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import image from "../assets/user.png";
import pluralize from "pluralize";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import "../CSS/users.css";
import Notification from "../components/notification";
import { ToastContainer } from "react-toastify";
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
function Profile() {
  const LIMIT = 5;
  const navigate = useNavigate()
  const { isOpen, user,setUser,setAccessToken,setLoggedIn } = useContext(AppContext);
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
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
              const history = [...data.history, ...data.inventory_history]
              setUserHistory(history)
              setLoading(false)
            }
          })
        }
        else{
            navigate('/login')
        }
  }, []);
  
  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  return (
    <div className="main">
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
            {loading ? null : <h3>Profile/{user.username}</h3>}
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
             <div className="edit">
                <ModeEditOutlineRoundedIcon />
             </div>
              <div className="profile-img">
                <img style={{ maxWidth: "200px" }} src={image} alt="user" />
              </div>
              <div className="profile-details">
                <div>
                  <span>
                    <strong>Username:</strong> {user.username}
                  </span>
                  <span>
                    <strong>Email:</strong> {user.email}
                  </span>
                </div>
                <div>
                  <span>
                    <strong>Role:</strong> {user.role.name}
                  </span>
                  <span>
                    <strong>Contact:</strong> {user.contact}
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
            <h3 style={{color:'var(--blue)', textAlign:'left', marginTop:"-10px", opacity:"0.8"}}>User history</h3>
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
                      <HeaderCell>Type</HeaderCell>
                      <HeaderCell >Name</HeaderCell>
                      <HeaderCell>Action</HeaderCell>
                      
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item, index) => (
                      <Row key={index} item={item}>
                       <Cell>{new Date(item.date).toISOString().split('.')[0].replace('T', ' ')}</Cell>
                        <Cell>{item.asset? item.asset['serial_number']: item.inventory_item['serial_number'] }</Cell> 
                        <Cell>{item.type}</Cell>
                        <Cell>{item.asset ? item.asset['name'] : pluralize.singular(item.name)}</Cell>               
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
export default Profile;
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
import { AssignmentTurnedInRounded } from "@mui/icons-material";
function Returns() {
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
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const key = "Composed Table";
  const [currentPage, setCurrentPage] = useState(0);  
  const [assets, setAssets] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const theme = useTheme(getTheme());
  const filteredData = assets?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      setAssets(JSON.parse(localStorage.getItem("unassingnedassets")));
     
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
    getAssets();
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
        const assignedAssets = data.filter(asset => asset.status !== "unassigned")
        localStorage.removeItem("unassingnedassets");
        localStorage.setItem("unassingnedassets", JSON.stringify(assignedAssets));
        const assetsInAlphabeticalOrder = assignedAssets.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setAssets(assetsInAlphabeticalOrder);
      });
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
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
                           
                              <span onClick={(() => navigate(`/returns/${item.name}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                              <span onClick={(() =>setShowReturnModal(true))}>
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
          <div></div>
        )}
      </div>
      
    </>
  );
}
export default Returns;

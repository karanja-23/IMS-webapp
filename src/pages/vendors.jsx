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

function Vendors() {
  const LIMIT = 4;
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
    vendors,
    setVendors
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true); 
  const [search, setSearch] = useState("");
  const [actionRowId, setActionRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const theme = useTheme(getTheme());
  const filteredData = vendors?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData?.length / LIMIT);
  const paginatedData = filteredData?.slice(
    currentPage * LIMIT,
    (currentPage + 1) * LIMIT
  );

  useEffect(() => {
    if (loggedIn) {
      const storedVendors = localStorage.getItem("vendors");
      if (storedVendors) {
        setVendors(JSON.parse(storedVendors));       
        navigate("/vendors");
      } else {
        fetch("https://mobileimsbackend.onrender.com/vendors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setVendors(data);
            localStorage.removeItem("vendors");
            localStorage.setItem("vendors", JSON.stringify(data));            
            navigate("/vendors");
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
            if (vendors.length > 0) {
              return;
            }
            getVendors();
          })
          
          
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);
useEffect(() => {
  getVendors();
},[])


  async function getVendors() {
    fetch("https://mobileimsbackend.onrender.com/vendors", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setVendors(data);
        localStorage.removeItem("vendors");
        localStorage.setItem("vendors", JSON.stringify(data));
      });
  }


  function handleSearch(event) {
    setSearch(event.target.value);
    setCurrentPage(0);
  }
  function handleDelete(id){
    fetch(`https://mobileimsbackend.onrender.com/vendors/${id}`,{
      method: 'DELETE',
      headers: {
          "Content-Type": "application/json"
      },
     
  })
  .then(response => response.json())
  .then((body) =>{
    if (body["messge"] ='Vendor deleted'){
      toast("Vendor deleted succesfully", {
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
      getVendors()
    }
  })
  }
 
  return (
    <>
      <div className="main" style={{ opacity:  0.99 }}>
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
           <div className="header" style={{width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',transition: '0.3s'}}>
            <div className="title">
              <h2>Vendors</h2>
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
                  navigate("/vendors/add");
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
                add new vendor
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
                      <HeaderCell>Contact Person</HeaderCell>
                      <HeaderCell>action</HeaderCell>
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList.map((item) => (
                      <Row key={item.id} item={item}>
                        <Cell>{item.name}</Cell>
                        <Cell>{item.email}</Cell>                        
                        <Cell>{item.contact_person_name}</Cell>
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
                              <span onClick={(() => navigate(`/vendors/${item.name}`,{state:{id:item.id}}))}>
                                <RemoveRedEyeRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                view
                              </span>
                              <span onClick={() => navigate(`/vendors/edit/${item.name}`,{state:{id:item.id}})}>
                                <EditRoundedIcon
                                  style={{ fontSize: "1.3em" }}
                                />
                                edit
                              </span>
                              <span onClick={() => handleDelete(item.id)}>
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

    </>
  );
}
export default Vendors;

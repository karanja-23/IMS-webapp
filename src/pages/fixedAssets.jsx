import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../CSS/team.css";

function FixedAssets() {
    const LIMIT = 7;
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn, accessToken, setAccessToken, isOpen, team, setTeam } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionRowId, setActionRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const theme = useTheme(getTheme());
    
    const filteredData = team.filter((item) => item.assetName.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredData.length / LIMIT);
    const paginatedData = filteredData.slice(currentPage * LIMIT, (currentPage + 1) * LIMIT);

    useEffect(() => {
        if (!loggedIn) {
            const token = localStorage.getItem("token");
            if (token) {
                setAccessToken(token);
                fetch(`http://172.236.2.18:5000/users/protected/user`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        setLoggedIn(true);
                        setIsLoading(false);
                        setTeam(JSON.parse(localStorage.getItem("fixedAssets")) || []);
                    }
                });
            } else {
                navigate("/login");
            }
        }
    }, [loggedIn]);

    function handleSearch(event) {
        setSearch(event.target.value);
        setCurrentPage(0);
    }
    
    return (
        <div className="main" style={{ opacity: 0.99 }}> 
            <SidebarComponent />
            <ToastContainer />
            <div className="content" style={{ width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)', left: isOpen ? 202 : 62, transition: '0.3s' }}>
                <div className="header">
                    <div className="title">
                        <WorkspacesRoundedIcon style={{ marginRight: '10px' }} />
                        <h2>Fixed Assets</h2>
                    </div>
                    <div className="notification">
                        <CircleNotificationsRoundedIcon style={{ marginRight: '10px', fontSize: '1.9rem' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', marginLeft: '5%', flexDirection: 'column', maxWidth: '90%', opacity: '0.8' }}> 
                    <div style={{ display: 'flex', alignItems: 'center', margin: "50px 0px 40px 10px", justifyContent: 'space-between' }}>
                        <input
                            type="search"
                            placeholder="Search assets..."
                            value={search}
                            onChange={handleSearch}
                            style={{ width: '25%', padding: '7px 12px', opacity: '0.9', outline: 'none', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f5f5f5', fontSize: '14px' }}
                        />
                        <div style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', gap: '3px', backgroundColor: '#FC4F11', color: 'white', padding: "5px 8px", fontWeight: '600', opacity: '0.9', borderRadius: "3px" }}>
                            <ControlPointRoundedIcon />
                            Add Asset
                        </div>
                    </div>
                    
                    <Table data={{ nodes: paginatedData }} theme={theme} className="table">
                        {(tableList) => (
                            <>
                                <Header>
                                    <HeaderRow>
                                        <HeaderCell>Asset Name</HeaderCell>
                                        <HeaderCell>Category</HeaderCell>
                                        <HeaderCell>Value</HeaderCell>
                                        <HeaderCell>Location</HeaderCell>
                                        <HeaderCell>Action</HeaderCell>
                                    </HeaderRow>
                                </Header>
                                <Body>
                                    {tableList.map((item) => (
                                        <Row key={item.id} item={item}>
                                            <Cell>{item.assetName}</Cell>
                                            <Cell>{item.category}</Cell>
                                            <Cell>{item.value}</Cell>
                                            <Cell>{item.location}</Cell>
                                            <Cell>
                                                <MoreVertRoundedIcon onClick={(event) => {
                                                    event.stopPropagation();
                                                    setActionRowId(actionRowId === item.id ? null : item.id);
                                                }} />
                                                {actionRowId === item.id && (
                                                    <div className="action-modal">
                                                        <span>
                                                            <EditRoundedIcon style={{ fontSize: "1.3em" }} /> Edit
                                                        </span>
                                                        <span>
                                                            <DeleteRoundedIcon style={{ fontSize: "1.3em" }} /> Delete
                                                        </span>
                                                    </div>
                                                )}
                                            </Cell>
                                        </Row>
                                    ))}
                                </Body>
                            </>
                        )}
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default FixedAssets;

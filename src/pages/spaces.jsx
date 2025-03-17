import SidebarComponent from "../components/sidebar";
import { useContext , useEffect, useState} from "react";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
  } from '@table-library/react-table-library/table';
  import "../CSS/team.css";
  import { useTheme } from '@table-library/react-table-library/theme';
  import { getTheme } from '@table-library/react-table-library/baseline';
function Spaces() {
    const navigate = useNavigate();
    const theme =useTheme(getTheme());
    const [spaces, setSpaces] = useState([]);
    const{isOpen,loggedIn,setLoggedIn,setAccessToken,setUser,setIsLoading} = useContext(AppContext)
    if (loggedIn) {
        navigate("/spaces");
    }
   else {
    const token = localStorage.getItem("token");
    
    if (token) {
      setAccessToken(token);
      fetch(`http://172.236.2.18:5000/users/protected/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUser(data);
            setLoggedIn(true);
            setIsLoading(false);
          }
        })
        .then(() => {
          if (spaces.length > 0) {
            return;
          }
          const mySpaces = localStorage.getItem("spaces");
          if (mySpaces) {
            setSpaces(JSON.parse(myRoles));
          }
          getSpaces();
        });
    } else {
      navigate("/login");
    }
  }
    useEffect(() => {
        if(spaces.length > 0){
            return;
        }
        getSpaces()
    },[loggedIn])
    async function getSpaces(){
        fetch('https://mobileimsbackend.onrender.com/spaces/all',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            localStorage.setItem("spaces", JSON.stringify(data));
            setSpaces(data)
            
        })
    }
    
    return (
    <div className="main">           
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s'}} >
            <div className="header">
                <div className="title">                
                    <h2>Spaces</h2>
                    
                </div>
                <div className="notification">
                    <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
                    
                </div>

            </div>
        </div>
        <div style={{display: 'flex', marginLeft:'5%',flexDirection:'column' ,maxWidth:'90%',opacity: '0.8'}}> 

              <div style={{display: 'flex', alignItems: 'center' ,margin: "50px 0px 40px 10px", justifyContent: 'space-between'}}>
              <input
                type="search"
                placeholder="search ..."
                style={{
                    width: '25%',
                    padding: '7px 12px',
                    opacity: '0.9',
                    outline: 'none',
                    border: '1px solid #ccc', 
                    borderRadius: '5px', 
                    backgroundColor: '#f5f5f5',
                    fontSize: '14px',
                    transition: 'all 0.3s ease-in-out'
                }}
              >
              
              </input>
              <div style={{display:'flex',justifyItems:'center', alignItems:'center',gap: '3px',backgroundColor:'#FC4F11', color:'white', padding:"5px 8px", fontWeight:'600', opacity:'0.9', borderRadius:'5px', cursor:'pointer'}}>
                <ControlPointRoundedIcon />
                add new user

              </div>
              </div>
              <Table data={{nodes: spaces}} theme={theme} className="table">
                {
                  (tableList) =>(
                    <>
                      <Header>
                        <HeaderRow>
                          <HeaderCell>Name</HeaderCell>
                          <HeaderCell>Description</HeaderCell>
                          <HeaderCell>Location</HeaderCell>
                          <HeaderCell>Status</HeaderCell>
                          <HeaderCell> </HeaderCell>
                        </HeaderRow>
                      </Header>

                      <Body>
                       {tableList.map((item) =>(
                        <Row key={item.id} item={item}>
                          <Cell>{item.name}</Cell>
                          <Cell>{item.description}</Cell>
                          <Cell>{item.location}</Cell>
                          <Cell>{item.status}</Cell>
                          <Cell><MoreVertRoundedIcon /> </Cell>
                        </Row>
                       ))}

                        
                      </Body>
                    </>
                  )
                }
              </Table>            

            </div>
    </div>
    )
}
export default Spaces



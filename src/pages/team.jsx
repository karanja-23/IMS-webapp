import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import WorkspacesRoundedIcon from '@mui/icons-material/WorkspacesRounded'
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { use } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import "../CSS/team.css"
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
function Team() {

    const navigate = useNavigate();
    const {loggedIn, setLoggedIn ,user,setUser,accessToken,setAccessToken,isOpen,team, setTeam} =useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const key = 'Composed Table'
    
    const theme = useTheme(getTheme())
    console.log(team)
    useEffect(() => {
      if (loggedIn) {
     
        navigate("/team");
      }   
      else {
        const token = localStorage.getItem("token");

        if (token){
            setAccessToken(token)
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
                    setIsLoading(false)                            
                  }
                })
            }
            else{
                navigate("/login")
            }      
      }
      
    }, [loggedIn]);
    return (
    <div className="main">           
        <SidebarComponent />
        <div className="content" style={{boxSizing:'border-box',width: isOpen ? 'calc(100vw - 210px)' : 'calc(100vw - 70px)',left: isOpen ? 202 : 62, transition: '0.3s',}} >
            <div className="header">
                <div className="title">
                    <WorkspacesRoundedIcon style={{marginRight: '10px'}}/>
                    <h2>Team</h2>
                    
                </div>
                <div className="notification">
                    <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
                    
                </div>

            </div>

            <div style={{display: 'flex', marginLeft:'5%',flexDirection:'column' ,maxWidth:'90%',opacity: '0.8'}}> 

              <div style={{display: 'flex', alignItems: 'center' ,margin: "50px 0px 40px 10px", justifyContent: 'space-between'}}>
              <input
                type="search"
                placeholder="search ..."
                style={{ width: '35%', padding: "5px 12px",opacity: '0.9ss' }}
              >
              
              </input>
              <div style={{display:'flex',justifyItems:'center', alignItems:'center',gap: '3px',backgroundColor:'#FC4F11', color:'white', padding:"5px 8px", fontWeight:'600', opacity:'0.9'}}>
                <ControlPointRoundedIcon />
                add new user

              </div>
              </div>
              <Table data={{nodes: team}} theme={theme} className="table">
                {
                  (tableList) =>(
                    <>
                      <Header>
                        <HeaderRow>
                          <HeaderCell>Name</HeaderCell>
                          <HeaderCell>Email</HeaderCell>
                          <HeaderCell>Contact</HeaderCell>
                          <HeaderCell>Role</HeaderCell>
                          <HeaderCell>action</HeaderCell>
                        </HeaderRow>
                      </Header>

                      <Body>
                       {tableList.map((item) =>(
                        <Row key={item.id} item={item}>
                          <Cell>{item.username}</Cell>
                          <Cell>{item.email}</Cell>
                          <Cell>{item.contact}</Cell>
                          <Cell>{item.role['name']}</Cell>
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
    </div>
    )
}
export default Team
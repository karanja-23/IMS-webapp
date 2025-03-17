import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { useContext } from 'react';
import { AppContext } from '../context/context';
function Notification() {  
    const {user} = useContext(AppContext)
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good morning";
        if (hour >= 12 && hour < 17) return "Good afternoon";
        if (hour >= 17 && hour < 21) return "Good evening";
        return "Good night";
    };
    return (
        <div className="notification">
        <span style={{fontSize: '0.9rem'}} >{getGreeting()}, {user.name?.split(' ')[0]} 👋</span>
            <CircleNotificationsRoundedIcon style={{marginRight: '10px', fontSize: '1.9rem'}}/>
            
        </div>
    ) 
}

export default Notification
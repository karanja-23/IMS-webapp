import  Home from "../components/home"
import Login from "../components/login"
const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    }

    
]

export default routes
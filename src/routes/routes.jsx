import Home from "../pages/home"
import Login from "../components/login"
import FixedAssets from "../pages/fixedAssets"
import Orders from "../pages/orders"
import Vendors from "../pages/vendors"
import Requests from "../pages/requests"
import Spaces from "../pages/spaces"
import Team from "../pages/team"
import Permissions from "../pages/permissions"
import ViewUsers from "../pages/viewUsers"
import AddVendor from "../pages/addvendor"
import ViewVendor from "../pages/viewVendor"
import EditVendors from "../pages/editVendor"
import Returns from "../pages/returns"
import ViewAssets from "../pages/viewAssets"
import ViewReturns from "../pages/viewReturns"
import ViewSpace from "../pages/viewspace"
const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/fixedAssets",
        element: <FixedAssets />,
    },
    {
        path: "/fixedAssets/:id",
        element: <ViewAssets />
    },
    {
        path: "/returns",
        element: <Returns />,
    },
    {
        path: "/returns/:id",
        element: <ViewReturns />
    }
    ,
    {
        path: "/orders",
        element: <Orders />,
    },
    {
        path: "/vendors",
        element: <Vendors />,
    },
    {
        path: "/vendors/:id",
        element: <ViewVendor />,
    },
    {
        path: "/vendors/edit/:id",
        element: <EditVendors />,
    },
    {
        path: "/requests",
        element: <Requests />,
    },
    {
        path: "/spaces",
        element: <Spaces />,
    },
    {
        path: "/spaces/view/:id",
        element: <ViewSpace />
    }
    ,
    {
        path: "/team",
        element: <Team />,
    },
    {
        path: "/permissions",
        element: <Permissions />,
    },
    {
        path: "team/:id",
        element: <ViewUsers />,
    },
    {
        path: "vendors/add",
        element: <AddVendor />,
    }
]

export default routes
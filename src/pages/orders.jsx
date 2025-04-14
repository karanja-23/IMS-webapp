import SidebarComponent from "../components/sidebar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";
import Notification from "../components/notification";
import { ToastContainer } from "react-toastify";
function Orders() {
  const { isOpen, loggedIn, setAccessToken, setLoggedIn } =
    useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrderDetais, setLoadingOrderDetails] = useState(false);
  useEffect(() => {
    if (loggedIn) {
      const ordersInAlphabeticalOrder = JSON.parse(
        localStorage.getItem("orders")
      )?.sort((a, b) => a.order_id.localeCompare(b.order_id));

      setOrders(ordersInAlphabeticalOrder);
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
            if (orders.length === 0) {
              gettOrders();
            }
          });
      } else {
        navigate("/login");
      }
    }
  }, []);
  async function gettOrders() {}
  return (
    <>
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
          {loadingOrderDetais ? <Loading /> : null}
          <div
            className="header"
            style={{
              width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
              transition: "0.3s",
            }}
          >
            <div className="title">
              <h2>Orders</h2>
            </div>
            <Notification />
          </div>
        </div>
      </div>
    </>
  );
}
export default Orders;

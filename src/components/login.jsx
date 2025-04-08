import "../CSS/login.css";
import logo from "../assets/logo.png";
import { useState, useContext } from "react";
import { AppContext } from "../context/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [checked, setChecked] = useState(false);

  const {
    setUser,
    setAccessToken,
    setLoggedIn,
    setTeam,
    setRoles,
    setAssets,
    setVendors,
    setCategories,
    setSpaces,
    setRequests,
    setReturns,
    setPermissions,
    setInventories
  } = useContext(AppContext);

  const navigate = useNavigate();

  async function fetchData(token) {
    try {
      const [inventoriesRes,permissionsRes ,requestsRes,spacesRes,categoriesRes,rolesRes, vendorsRes, assetsRes, usersRes, assignedInventoriesRes] = await Promise.all([
        
        fetch("https://mobileimsbackend.onrender.com/inventory").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/permissions/all").then((res) => res.json()),
        fetch('https://mobileimsbackend.onrender.com/requests').then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/spaces/all").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/categories").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/roles/all").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/vendors").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/assets").then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/users", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        }).then((res) => res.json()),
        fetch("https://mobileimsbackend.onrender.com/inventory/items").then((res) => res.json()),
      ]);
      setInventories(inventoriesRes)
      setPermissions(permissionsRes)
      setRequests(requestsRes)
      setSpaces(spacesRes)
      setCategories(categoriesRes)
      setRoles(rolesRes);
      setVendors(vendorsRes);
      setAssets(assetsRes.sort((a, b) => a.serial_number.localeCompare(b.serial_number)));
      setTeam(usersRes);
      
      const assignedAssets = assetsRes.filter(asset => asset.status !== "unassigned")
      const assignedInventories = assignedInventoriesRes.filter(inventory=> inventory.status !== "unassigned")
      console.log([...assignedAssets, ...assignedInventories])
      setReturns([...assignedAssets, ...assignedInventories])

      localStorage.setItem("permissions", JSON.stringify(permissionsRes));
      localStorage.setItem("inventories", JSON.stringify(inventoriesRes));
      localStorage.setItem("unassingnedassets", JSON.stringify([...assignedAssets, ...assignedInventories]));
      localStorage.setItem("requests", JSON.stringify(requestsRes));
      localStorage.setItem("spaces", JSON.stringify(spacesRes));
      localStorage.setItem("categories", JSON.stringify(categoriesRes));
      localStorage.setItem("roles", JSON.stringify(rolesRes));
      localStorage.setItem("vendors", JSON.stringify(vendorsRes));
      localStorage.setItem("assets", JSON.stringify(assetsRes));
      localStorage.setItem("team", JSON.stringify(usersRes));
    } catch (error) {
      toast("Error fetching data", { theme: "dark" });
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast("Please enter your email and password", {
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
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://mobileimsbackend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (data.error) {
        toast(data.error, {
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
        setIsLoading(false);
        return;
      }

      if (data.access_token) {
        setAccessToken(data.access_token);
        if (checked) localStorage.setItem("token", data.access_token);

        const userRes = await fetch("https://mobileimsbackend.onrender.com/protected/user", {
          method: "GET",
          headers: { "Authorization": `Bearer ${data.access_token}` },
        }).then((res) => res.json());
        
        setUser(userRes);
        setWelcome(true);

        await fetchData(data.access_token);
        setIsLoading(false);
        setLoggedIn(true);
        setTimeout(() => {          
          navigate("/");
        }, 1000);
        
        setTimeout(() => {
          setWelcome(false);
        }, 1500);
      }
    } catch (error) {
      toast("Login failed", { theme: "dark" });
      setIsLoading(false);
    }
  }

  if (welcome) return <Loading />;

  return (
    <div className="login">
      <div className="image"></div>
      <ToastContainer />
      <div className="form">
        <img src={logo} alt="logo" />
        <h2>Welcome back to Moringa School IMS</h2>
        <form id="form" onSubmit={handleLogin}>
          <h4 id="inst">Please enter your email and password:</h4>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="johndoe@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="johndoe@123" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "left",
              paddingLeft: "17%",
            }}
          >
            <input
              style={{ marginRight: "10px", width: "15px", height: "15px" }}
              onChange={(event) => setChecked(event.target.checked)}
              checked={checked}
              type="checkbox"
              id="remember"
              name="remember"
            />
            <label
              style={{ marginLeft: "5px", fontSize: "14px", fontWeight: "500" }}
              htmlFor="remember"
            >
              Remember me
            </label>
          </div>
          <button type="submit">
            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin size="lg" color="#fff" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

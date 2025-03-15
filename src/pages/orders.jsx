import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SidebarComponent from "../components/sidebar";
import { useContext } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from "@mui/icons-material/CircleNotificationsRounded";

const Orders = () => {
  const { isOpen } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([
    { id: 1, name: "Order A", date: "2025-03-10", status: "Pending" },
    { id: 2, name: "Order B", date: "2025-03-11", status: "Received" },
    { id: 3, name: "Order C", date: "2025-03-12", status: "Pending" },
  ]);

  // Open edit modal
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditing(true);
    setOpen(true);
  };

  // Open add modal
  const handleAddClick = () => {
    setSelectedOrder({
      id: orders.length + 1, // Generate new ID
      name: "",
      date: new Date().toISOString().split("T")[0], // Default to today
      status: "Pending", // Default status
    });
    setIsEditing(false);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  // Save edited/new order
  const handleSave = () => {
    if (isEditing) {
      setOrders(orders.map(order => (order.id === selectedOrder.id ? selectedOrder : order)));
    } else {
      setOrders([...orders, selectedOrder]);
    }
    handleClose();
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSelectedOrder({ ...selectedOrder, [e.target.name]: e.target.value });
  };

  // Handle dropdown change for status
  const handleStatusChange = (event) => {
    setSelectedOrder({ ...selectedOrder, status: event.target.value });
  };

  const columns = [
    { field: "id", headerName: "ORDER ID", flex: 1 },
    { field: "name", headerName: "NAME", flex: 1 },
    { field: "date", headerName: "DATE", flex: 1 },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          p="5px"
          borderRadius="4px"
          textAlign="center"
          sx={{
            backgroundColor: row.status === "Pending" ? "lightcoral" : "lightgreen",
            color: "black",
            width: "100px",
          }}
        >
          {row.status}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditClick(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="main">
      <SidebarComponent />
      <div
        className="content"
        style={{
          boxSizing: "border-box",
          width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
          left: isOpen ? 202 : 62,
          transition: "0.3s",
        }}
      >
        <div className="header">
          <div className="title">
            <h2>Orders</h2>
          </div>

          {/* Add Order Button */}
          <Button
            variant="contained"
            color="success"
            onClick={handleAddClick}
            style={{ marginLeft: "20px" }}
          >
            Add New Order
          </Button>

          <div className="notification">
            <CircleNotificationsRoundedIcon
              style={{ marginRight: "10px", fontSize: "1.9rem" }}
            />
          </div>
        </div>

        <Box m="20px">
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={5}
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                color: "black",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #ddd",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Box>
      </div>

      {/* Add/Edit Order Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Order Status" : "Add New Order"}</DialogTitle>
        <DialogContent sx={{ width: "500px", padding: "20px" }}>
          {selectedOrder && (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField
                name="name"
                label="Order Name"
                value={selectedOrder.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="date"
                label="Date"
                type="date"
                value={selectedOrder.date}
                onChange={handleInputChange}
                fullWidth
              />

              {/* Status Dropdown */}
              <Select
                name="status"
                value={selectedOrder.status}
                onChange={handleStatusChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
              </Select>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEditing ? "Save Changes" : "Add Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Orders;

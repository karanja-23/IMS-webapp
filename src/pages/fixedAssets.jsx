import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SidebarComponent from "../components/sidebar";
import { useContext } from "react";
import { AppContext } from "../context/context";
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';

const FixedAssets = () => {
  const { isOpen } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, serialNo: "FA001", item: "Laptop", classCode: "IT001", depreciationRate: "20%", status: "Assigned" },
    { id: 2, serialNo: "FA002", item: "Printer", classCode: "IT002", depreciationRate: "15%", status: "Available" },
    { id: 3, serialNo: "FA003", item: "Office Chair", classCode: "FUR001", depreciationRate: "10%", status: "Unassigned" },
  ]);

  // Open edit modal
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
    setOpen(true);
  };

  // Open add modal
  const handleAddClick = () => {
    setSelectedRow({
      id: rows.length + 1, // Generate new ID
      serialNo: "",
      item: "",
      classCode: "",
      depreciationRate: "",
      status: "Available", // Default status
    });
    setIsEditing(false);
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Save edited/new data
  const handleSave = () => {
    if (isEditing) {
      setRows(rows.map(row => (row.id === selectedRow.id ? selectedRow : row)));
    } else {
      setRows([...rows, selectedRow]);
    }
    handleClose();
  };

  // Handle input change for text fields
  const handleInputChange = (e) => {
    setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });
  };

  // Handle dropdown change for status field
  const handleStatusChange = (event) => {
    setSelectedRow({ ...selectedRow, status: event.target.value });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "item", headerName: "Item", flex: 1 },
    { field: "serialNo", headerName: "Serial No.", flex: 1 },
    { field: "classCode", headerName: "Class Code", flex: 1 },
    { field: "depreciationRate", headerName: "Depreciation Rate", flex: 1 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          p="5px"
          borderRadius="4px"
          textAlign="center"
          sx={{
            backgroundColor: row.status === "Assigned" ? "lightgreen" : 
                            row.status === "Available" ? "lightblue" : "lightcoral",
            color: "black",
            width: "100px",
          }}
        >
          {row.status}
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" size="small" startIcon={<EditIcon />} onClick={() => handleEditClick(row)}>
            Edit
          </Button>
          <Button variant="contained" color="error" size="small" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div className="main">
      <SidebarComponent />
      <div className="content" 
        style={{
          boxSizing: "border-box",
          width: isOpen ? "calc(100vw - 210px)" : "calc(100vw - 70px)",
          left: isOpen ? 202 : 62, 
          transition: "0.3s"
        }}
      >
        <div className="header">
          <div className="title">                
            <h2>Fixed Assets</h2>
          </div>

          {/* Add New Asset Button */}
          <Button variant="contained" color="success" onClick={handleAddClick} style={{ marginLeft: "20px" }}>
            Add New Asset
          </Button>

          <div className="notification">
            <CircleNotificationsRoundedIcon style={{ marginRight: "10px", fontSize: "1.9rem" }} />
          </div>
        </div>
        
        <Box m="20px">
          <DataGrid
            rows={rows}
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

      {/* Add/Edit Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        <DialogContent sx={{ width: "500px", padding: "20px" }}>
          {selectedRow && (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <TextField name="serialNo" label="Serial No." value={selectedRow.serialNo} onChange={handleInputChange} fullWidth />
              <TextField name="item" label="Item" value={selectedRow.item} onChange={handleInputChange} fullWidth />
              <TextField name="classCode" label="Class Code" value={selectedRow.classCode} onChange={handleInputChange} fullWidth />
              <TextField name="depreciationRate" label="Depreciation Rate" value={selectedRow.depreciationRate} onChange={handleInputChange} fullWidth />

              {/* Status Dropdown */}
              <Select
                name="status"
                value={selectedRow.status}
                onChange={handleStatusChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="Assigned">Assigned</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unassigned">Unassigned</MenuItem>
              </Select>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">{isEditing ? "Save Changes" : "Add Asset"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FixedAssets;

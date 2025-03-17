import { CircularProgress } from "@mui/material";
function Loading() {    
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress color="#FC4F11" />
        </div>
      );
}

export default Loading
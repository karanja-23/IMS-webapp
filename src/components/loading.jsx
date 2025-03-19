import { CircularProgress } from "@mui/material";
function Loading() {    
    return (
        <div style={{position: "absolute", top: 0, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", backgroundColor: "transparent"}}>
          <CircularProgress color="#FC4F11" />
        </div>
      );
}

export default Loading
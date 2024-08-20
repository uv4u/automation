import SideNav from "../Drawer";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconButton, ListItemButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../styles.css";
const RunHistory = () => {
  const [history, setHistory] = useState({});

  const handleFetch = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/get-history/");
    console.log(res.data.history[0]);
    setHistory(res.data.history);
  };

  const handleClear = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/clear-history/");
    setHistory({});
  };

  useEffect(() => {
    handleFetch();
  }, []);
  return (
    <div className="d-flex">
      <SideNav />
      <div className="col-lg-10">
        <div className="d-flex justify-content-between col-lg-12 top-heading">
          <h4>Run History</h4>
        </div>
        <div
          className="d-flex col-lg-12 top-heading"
          style={{
            borderBottom: "1px solid rgb(120, 119, 119, .1)",
          }}
        >
          {/* <ListItemButton className="check">
            <input type="checkbox" />
          </ListItemButton> */}
          <ListItemButton className="last-result" sx={{ color: "grey" }}>
            TIME
          </ListItemButton>
          <ListItemButton className="last-result" sx={{ color: "grey" }}>
            NAME
          </ListItemButton>
          <ListItemButton sx={{ color: "grey" }} className="action">
            TYPE
          </ListItemButton>
          <ListItemButton sx={{ color: "grey" }} className="action">
            RESULT
          </ListItemButton>
        </div>
        {Object.keys(history).length === 0 && (
          <div
            className="d-flex justify-content-center"
            style={{ fontWeight: 500, paddingTop: 14 }}
          >
            <p>No history found</p>
          </div>
        )}
        {Object.entries(history).map(
          ([history, { ename, results, run_type, timestamp }]) => (
            <div
              className="d-flex justify-content-around top-heading col-lg-12"
              style={{
                marginTop: 20,
                marginBottom: 20,
                borderBottom: "1px solid rgb(120, 119, 119, .1)",
              }}
              key={history}
            >
              <ListItemButton className="last-result">
                {timestamp}
              </ListItemButton>
              <ListItemButton className="last-result">{ename}</ListItemButton>
              <ListItemButton className="action">{run_type}</ListItemButton>
              <ListItemButton className="action">{results}</ListItemButton>
            </div>
          )
        )}

        {history.length !== 0 && (
          <ListItemButton
            // className="action"
            style={{
              marginLeft: "85%",
              fontWeight: 600,
              position: "relative",
            }}
            onClick={handleClear}
          >
            Clear History
            <DeleteIcon />
          </ListItemButton>
        )}
      </div>
    </div>
  );
};
export default RunHistory;

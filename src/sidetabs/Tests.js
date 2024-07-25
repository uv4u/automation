import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton, ListItemButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../styles.css";
import { useState, useEffect, useRef } from "react";
import BasicModal from "../Components/BasicModal";
import Tooltip from "@mui/material/Tooltip";
import SideNav from "../Drawer";
import { Modal, Button } from "react-bootstrap";
import RecordingComponent from "./RecordingComponent.js";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Tests = () => {
  const [testc, setTestc] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [toggle, setToggle] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");
  const iframeRef = useRef(null);

  const [scripts, setScripts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/load-url", {
        url,
      });
      console.log("URL submitted successfully:", response.data);
      iframeRef.current.src = `http://127.0.0.1:5000/proxy?url=${encodeURIComponent(
        url
      )}`; // Load the URL through the proxy
    } catch (error) {
      console.error("Error submitting URL:", error);
    }
  };

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      const { data } = event;
      if (data.type === "recordedActions") {
        console.log("Received recorded actions:", data.recordedActions);
        // Handle the recorded actions here (e.g., save to state or send to backend)
      }
    };

    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearch(searchText);
    const filteredResults = scripts.filter((item) =>
      item.toLowerCase().includes(searchText)
    );
    setSearchResult(filteredResults);
  };

  const handleBlur = () => {
    setSearch("");
    setSearchResult([]);
    setToggle(true);
  };

  const handleFocus = () => {
    setToggle(false);
  };

  const testList = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/get-script-list/"
    );
    console.log(response);
    setTestc(response.data.scripts);
  };

  const handlePlay = async (req) => {
    try {
      console.log(req);
      const res = await axios.post("http://127.0.0.1:8000/api/run-script/", {
        script_name: req,
      });
      console.log(res.data.stdout);
      alert(res.data.stdout);
    } catch (error) {
      console.error("Error running script:", error);
      alert("Failed to run the script. Please try again.");
    }
  };

  const handleDelete = async (req) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/delete-script/", {
        name: req,
      });
      console.log(res);
      if (res.statusText === "OK") {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchScripts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get-script-list/"
      );
      if (response.data.status === "success") {
        setScripts(response.data.scripts);
      }
    } catch (error) {
      console.error("Error fetching scripts:", error);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  return (
    <div className="d-flex">
      <SideNav />
      <div className="col-lg-10">
        <div className="d-flex justify-content-between col-lg-12 top-heading">
          <h4 onClick={testList}>Tests</h4>

          <div className="d-flex flex-row-reverse">
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <BasicModal setState={setTestc} state={testc} />
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={handleSearch}
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </div>
        </div>
        <div
          className="d-flex col-lg-12 top-heading"
          style={{
            borderBottom: "1px solid rgb(120, 119, 119, .1)",
          }}
        >
          <ListItemButton className="check">
            <input type="checkbox" />
          </ListItemButton>
          <ListItemButton className="name" sx={{ color: "grey" }}>
            NAME
          </ListItemButton>
          <ListItemButton className="last-result" sx={{ color: "grey" }}>
            LAST RESULT
          </ListItemButton>
          <ListItemButton sx={{ color: "grey" }} className="action">
            ACTION
          </ListItemButton>
        </div>
        {(toggle ? scripts : searchResult).map((item, index) => (
          <div
            className="d-flex justify-content-around"
            style={{
              marginTop: 20,
              marginBottom: 20,
              borderBottom: "1px solid rgb(120, 119, 119, .1)",
            }}
            key={index}
          >
            <ListItemButton className="check">
              <input type="checkbox" id={item} />
            </ListItemButton>
            <ListItemButton className="name">{item}</ListItemButton>
            <ListItemButton className="last-result">{""}</ListItemButton>
            <span className="action">
              <IconButton
                id={item}
                onClick={() => {
                  handlePlay(`${item}.py`);
                }}
              >
                <Tooltip title="Run test">
                  <PlayArrowIcon />
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  handleDelete(item);
                }}
              >
                <Tooltip title="More option">
                  <MoreVertIcon />
                </Tooltip>
              </IconButton>
            </span>
          </div>
        ))}
        <div>
          {/* <Button variant="primary" onClick={handleShow}>
            Add
          </Button> */}

          {/* <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Record Actions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <RecordingComponent />
            </Modal.Body>
          </Modal> */}
        </div>
      </div>
    </div>
  );
};

export default Tests;

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton, ListItemButton } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../styles.css";
import { useState, useEffect, useRef } from "react";
import BasicModal from "../Components/BasicModal";
import Tooltip from "@mui/material/Tooltip";
import SideNav from "../Drawer";
import DeleteIcon from "@mui/icons-material/Delete";
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
      // console.log(res);
      console.log(res.data.stdout);
      if (res.data.returncode === 0) {
        alert("Test Case Passed");
      } else alert("Test Case Failed");
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
            className="d-flex justify-content-around top-heading"
            style={{
              marginTop: 20,
              marginBottom: 20,
              borderBottom: "1px solid rgb(120, 119, 119, .1)",
            }}
            key={index}
          >
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
                <Tooltip title="Delete">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tests;

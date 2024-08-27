import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton, ListItemButton, Typography } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../styles.css";
import { useState, useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import SideNav from "../Drawer";
// import DeleteIcon from "@mui/icons-material/Delete";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import BasicModal from "../Components/BasicModal";
import AlertDialog from "../Components/DeleteWarning";
import SimpleSnackbar from "../Components/Snackbar";
import TextEditor from "../Components/Editor";

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
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [toggle, setToggle] = useState(true);

  const [showModal, setShowModal] = useState(false);

  // const [snackSeverity, setSnackSeverity] = useState("");
  // const [snackText, setSnackText] = useState("");
  // const [showSnack, setShowSnack] = useState(false);

  const [scripts, setScripts] = useState([]);
  const [isSnackBarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");

  // const handleShow = () => setShowModal(true);
  // const handleClose = () => setShowModal(false);
  const [selectedFile, setSelectedFile] = useState(null); // State for the currently selected file

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
    console.log(`selectedFile is ${fileName}`);
  };

  const handleCloseEditor = () => {
    setSelectedFile(null);
  };

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

  const handlePlay = async (req) => {
    try {
      console.log(req);
      const res = await axios.post("http://127.0.0.1:8000/api/run-script/", {
        script_name: req,
      });
      setMessage(`${req} running...`);
      // console.log(res);
      setIsSnackbarOpen(true);
      console.log(res.data.stdout);
      if (res.data.returncode === 0) {
        setMessage(`${req} passed sucessfully!`);
      } else {
        setMessage(`${req} failed`);
      }
    } catch (error) {
      console.error("Error running script:", error);
    }
  };

  const handleDelete = async (req) => {
    console.log(req);
    const updatedItems = scripts.filter((item) => item !== req);
    console.log(updatedItems);
    setScripts(updatedItems);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/delete-script/", {
        name: req,
      });
      console.log(res);
      if (res.statusText === "OK") {
        setMessage("Testcase deleted!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

    fetchScripts();
    // setTimeout(()=> {

    // },1000);
  }, []);

  return (
    <div className="d-flex">
      <SideNav />
      <div className="col-lg-10">
        <div className="d-flex justify-content-between col-lg-12 top-heading">
          <div className="component-title">
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: "700", marginLeft: 1 }}
            >
              Tests
            </Typography>
          </div>

          <div className="d-flex flex-row-reverse">
            <BasicModal
              setState={setScripts}
              state={scripts}
              data={scripts.length}
            />
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
          {/* <ListItemButton className="last-result" sx={{ color: "grey" }}>
            LAST RESULT
          </ListItemButton> */}
          <ListItemButton sx={{ color: "grey" }} className="action">
            ACTION
          </ListItemButton>
        </div>
        {scripts.length === 0 && (
          <div style={{ paddingLeft: 50, paddingTop: 15, paddingRight: 100 }}>
            {/* <p>No tests found</p> */}
            <Skeleton variant="text" sx={{ width: 250 }} />
            <Skeleton variant="text" sx={{ width: 350 }} />
            <Skeleton variant="text" sx={{ width: 450 }} />
          </div>
        )}
        {(toggle ? scripts : searchResult).map((item, index) => (
          <div
            className="d-flex justify-content-around top-heading"
            style={{
              marginTop: 20,
              marginBottom: 20,
              borderBottom: "1px solid rgb(120, 119, 119, .1)",
            }}
            key={item}
          >
            <ListItemButton
              className="name"
              onClick={() => {
                handleFileSelect(`${item}.py`);
              }}
            >
              {item}
            </ListItemButton>
            {selectedFile === `${item}.py` && (
              <TextEditor fileName={selectedFile} onClose={handleCloseEditor} />
            )}
            {/* <ListItemButton className="last-result">{""}</ListItemButton> */}
            <ListItemButton className="action">
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

              <AlertDialog
                handler={() => {
                  handleDelete(`${item}`);
                }}
                setOpen={setIsSnackbarOpen}
              />
            </ListItemButton>
          </div>
        ))}
      </div>
      <SimpleSnackbar
        open={isSnackBarOpen}
        setOpen={setIsSnackbarOpen}
        message={message}
        key={message}
      />
    </div>
  );
};

export default Tests;

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { IconButton, ListItemButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../styles.css";
import { useState, useEffect } from "react";
import BasicModal from "../Components/BasicModal";
import Tooltip from "@mui/material/Tooltip";

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
    // vertical padding + font size from searchIcon
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

  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearch(searchText);
    const filteredResults = testc.filter((item) =>
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

  return (
    <div>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ paddingLeft: 10, paddingRight: 10 }}
      >
        <h4>Tests:</h4>
        <h4 style={{ marginRight: 640 }}>{testc.length}</h4>

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
        className="d-flex justify-content-around"
        style={{
          marginTop: 50,
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
      {/* {testc.map((item, index) => ( */}
      {(toggle ? testc : searchResult).map((item, index) => (
        <div
          className="d-flex justify-content-around"
          style={{
            marginTop: 20,
            marginBottom: 20,
            borderBottom: "1px solid rgb(120, 119, 119, .1)",
          }}
        >
          <ListItemButton className="check">
            <input type="checkbox" />
          </ListItemButton>
          <ListItemButton className="name" key="index">
            {/* {tc[0]} */}
            {item}
          </ListItemButton>
          <ListItemButton className="last-result">{""}</ListItemButton>
          <span className="action">
            <IconButton>
              <Tooltip title="Run test">
                <PlayArrowIcon />
              </Tooltip>
            </IconButton>
            <IconButton>
              <Tooltip title="More option">
                <MoreVertIcon />
              </Tooltip>
            </IconButton>
          </span>
        </div>
      ))}
    </div>
  );
};
export default Tests;

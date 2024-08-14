import { Link } from "react-router-dom";
import "../styles.css";
import { IconButton, ListItemButton } from "@mui/material";
import SideNav from "../Drawer";
import { useState, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Tooltip from "@mui/material/Tooltip";

import CustomizedDialogs from "./SuitesModel";

//search
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Suites = () => {
  const [testc, setTestc] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [suiteList, setSuiteList] = useState({});
  const [result, setResult] = useState([]);

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

  const fetchSuites = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/get-suites/");
    console.log(res.data.suites);
    setSuiteList(res.data.suites);
  };

  useEffect(() => {
    fetchSuites();
  }, []);

  const handleRun = async (item) => {
    const res = await axios.post("http://127.0.0.1:8000/api/run-suite/", {
      suite_name: item,
      test_cases: suiteList[item],
    });
    setResult(res.data.res);
    console.log(res);
  };

  const handleDelete = async (item) => {
    const res = await axios.post("http://127.0.0.1:8000/api/delete-suite/", {
      suite_name: item,
    });
    alert(res.data.message);
  };

  return (
    <div>
      <div className="d-flex">
        <SideNav />
        <div className="col-lg-10">
          <div className="d-flex justify-content-between col-lg-12 top-heading">
            <h4>Suites</h4>
            <div className="d-flex" style={{ gap: "16px" }}>
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
              <CustomizedDialogs />
              <IconButton>
                <MoreVertIcon />
              </IconButton>
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
              TEST RESULT
            </ListItemButton>
            {/* <ListItemButton className="last-result" sx={{ color: "grey" }}>
              LAST RESULT
            </ListItemButton> */}
            <ListItemButton sx={{ color: "grey" }} className="action">
              ACTION
            </ListItemButton>
          </div>
          {Object.entries(suiteList).map(
            ([suiteName, { test_cases, results }]) => (
              <div
                className="d-flex justify-content-around top-heading col-lg-12"
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  borderBottom: "1px solid rgb(120, 119, 119, .1)",
                }}
                key={suiteName}
              >
                <ListItemButton className="check">
                  <input type="checkbox" />
                </ListItemButton>
                <ListItemButton className="name" key="item">
                  {suiteName}
                  <div
                    className="d-flex justify-content-center"
                    style={{ fontSize: "0.7rem", padding: 4 }}
                  ></div>
                </ListItemButton>
                <ListItemButton className="last-result">
                  {result}
                  <div class="btn-group" style={{ marginRight: "50px" }}>
                    <button
                      class="btn btn-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ cursor: "unset" }}
                    >
                      See Results
                    </button>
                    <ul class="dropdown-menu">
                      {test_cases.map((testCase) => (
                        <li key={testCase}>
                          {console.log(` res: ${results["testCase"]} `)}
                          <p
                            style={{
                              fontWeight: 400,
                              fontFamily: "monospace",
                              fontSize: 13,
                            }}
                          >
                            Test Case: {testCase} - Result:{" "}
                            {results[testCase] || "Not Executed"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ListItemButton>
                <span className="action">
                  <IconButton
                    onClick={() => {
                      handleRun(suiteName);
                    }}
                  >
                    <Tooltip title="Run test">
                      <PlayArrowIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDelete(suiteName);
                    }}
                  >
                    <Tooltip title="More option">
                      <MoreVertIcon />
                    </Tooltip>
                  </IconButton>
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Suites;

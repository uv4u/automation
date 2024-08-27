import * as React from "react";
import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CodeIcon from "@mui/icons-material/Code";
import ReorderIcon from "@mui/icons-material/Reorder";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import HistoryIcon from "@mui/icons-material/History";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import "./styles.css";
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Typography } from "@mui/material";

import Alerts from "./sidetabs/Alerts";

const SideNav = () => {
  const [toggle, setToggle] = useState(true);
  const [short, setShort] = useState("col-lg-2");
  const [long, setLong] = useState("col-lg-10");

  const chnageShort = () => {
    if (toggle === true) {
      setShort("col-lg-1");
      setLong("col-lg-11");
      setToggle(false);
    } else if (toggle === false) {
      setShort("col-lg-2");
      setLong("col-lg-10");
      setToggle(true);
    }
  };
  return (
    <div
      className={`${short} grid-item`}
      style={{
        borderRight: `1px solid #EEEEEE`,
        paddingTop: 50,
      }}
    >
      {toggle && (
        <div className="project-name">
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: "700", marginLeft: 1 }}
          >
            JioPhotos
          </Typography>
        </div>
      )}
      <List
        sx={{
          ".css-10hburv-MuiTypography-root": {
            fontSize: "0.8rem",
            fontWeight: 700,

            color: "grey",
          },
        }}
      >
        <Link className="link" to="/test">
          <ListItemButton>
            <Tooltip title="Tests">
              <CodeIcon />
            </Tooltip>
            {toggle && <ListItemText alignitems="center" primary={"Tests"} />}
          </ListItemButton>
        </Link>
        <Link className="link" to="/suites">
          <ListItemButton>
            <Tooltip title="Suites">
              <ReorderIcon />
            </Tooltip>
            {toggle && <ListItemText primary={"Suites"} />}
          </ListItemButton>
        </Link>
        <Link className="link" to="/run-history">
          <ListItemButton>
            <Tooltip title="Run history">
              <ManageSearchIcon />
            </Tooltip>
            {toggle && <ListItemText primary={"Run history"} />}
          </ListItemButton>
        </Link>
      </List>
      <IconButton onClick={chnageShort}>
        {toggle ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </IconButton>
    </div>
  );
};

export default SideNav;

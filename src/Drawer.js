import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CodeIcon from "@mui/icons-material/Code";
import ReorderIcon from "@mui/icons-material/Reorder";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import HistoryIcon from "@mui/icons-material/History";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { Tooltip } from "@mui/material";

import Alerts from "./sidetabs/Alerts";

const SideNav = (props) => {
  return (
    <div>
      {props.show && <h3 style={{ marginLeft: 10 }}>Project1</h3>}
      <List
        sx={{
          ".css-10hburv-MuiTypography-root": {
            fontSize: "0.8rem",
            fontWeight: 700,

            color: "grey",
          },
        }}
      >
        <ListItemButton>
          <Tooltip title="Tests">
            <CodeIcon />
          </Tooltip>
          {props.show && <ListItemText alignitems="center" primary={"Tests"} />}
        </ListItemButton>
        <ListItemButton>
          <Tooltip title="Suites">
            <ReorderIcon />
          </Tooltip>
          {props.show && <ListItemText primary={"Suites"} />}
        </ListItemButton>
        <ListItemButton>
          <Tooltip title="Run history">
            <ManageSearchIcon />
          </Tooltip>
          {props.show && <ListItemText primary={"Run history"} />}
        </ListItemButton>
        <ListItemButton>
          <Tooltip title="Schedules">
            <HistoryIcon />
          </Tooltip>
          {props.show && <ListItemText primary={"Schedules"} />}
        </ListItemButton>
        <ListItemButton
        // onClick={<Alerts />}
        >
          <Tooltip title="Alerts">
            <AddAlertIcon />
          </Tooltip>
          {props.show && <ListItemText primary={"Alerts"} />}
        </ListItemButton>
      </List>
    </div>
  );
};

export default SideNav;

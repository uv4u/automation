import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CodeIcon from "@mui/icons-material/Code";
import ReorderIcon from "@mui/icons-material/Reorder";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import HistoryIcon from "@mui/icons-material/History";
import AddAlertIcon from "@mui/icons-material/AddAlert";

const SideNav = () => {
  return (
    <div>
      <h3 style={{ marginLeft: 10 }}>Project1</h3>
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
          <CodeIcon />
          <ListItemText alignitems="center" primary={"Tests"} />
        </ListItemButton>
        <ListItemButton>
          <ReorderIcon />
          <ListItemText primary={"Suites"} />
        </ListItemButton>
        <ListItemButton>
          <ManageSearchIcon />
          <ListItemText primary={"Run history"} />
        </ListItemButton>
        <ListItemButton>
          <HistoryIcon />
          <ListItemText primary={"Schedules"} />
        </ListItemButton>
        <ListItemButton>
          <AddAlertIcon />
          <ListItemText primary={"Alerts"} />
        </ListItemButton>
      </List>
    </div>
  );
};

export default SideNav;

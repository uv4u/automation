import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CodeIcon from "@mui/icons-material/Code";
import ReorderIcon from "@mui/icons-material/Reorder";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import HistoryIcon from "@mui/icons-material/History";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { Button } from "react-bootstrap";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 225 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
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
    </Box>
  );

  return (
    <div>
      <Button className="drawerbutton" onClick={toggleDrawer(true)}>
        Open drawer
      </Button>
      <Drawer
        // hideBackdrop={true}
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "&.MuiDrawer-root .MuiDrawer-paper": { marginTop: "39px" },
          ".css-10hburv-MuiTypography-root": { fontSize: "0.8rem" },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

import { ListItem, ListItemButton } from "@mui/material";
import SideNav from "../Drawer";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import EmailIcon from "@mui/icons-material/Email";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Switch from "@mui/material/Switch";
import "../styles.css";
const Alerts = () => {
  return (
    <div className="d-flex">
      <SideNav />
      <div
        className="d-flex align-items-center justify-content-around col-lg-10 alert"
        style={{ marginTop: 100, marginBottom: 200 }}
      >
        {/* <ListItemButton> */}
        <span>
          <b>Schedule finished</b>
        </span>
        <span>
          <ArrowRightAltIcon />
          <EmailIcon />
        </span>
        <span>
          <b>Send Notification</b>
        </span>
        <span>
          <Switch defaultChecked />
        </span>
        <span>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </span>
        {/* </ListItemButton> */}
      </div>
    </div>
  );
};
export default Alerts;

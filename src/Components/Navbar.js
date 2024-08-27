import HelpIcon from "@mui/icons-material/Help";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import BugReportIcon from "@mui/icons-material/BugReport";

const Navbar = () => {
  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(to right, #061161, #780206)",
          color: "white",
          height: 44,
        }}
        // color="transparent"
      >
        <nav
          className="navbar navbar-expand navbar-light"
          style={{ borderBottom: "1px solid #EEEEEE", height: 45 }}
        >
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              <BugReportIcon />
              Tester.ai
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Jiosnap
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Project1
                      </a>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <button>ADD</button>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-right dropstart">
              <IconButton
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <HelpIcon fontSize="medium" sx={{ color: "white" }} />
              </IconButton>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Documentation
                  </a>
                </li>
              </ul>
              <IconButton>
                <AccountCircleIcon fontSize="medium" sx={{ color: "white" }} />
              </IconButton>
            </div>
          </div>
        </nav>
      </AppBar>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "./styles.css";

//COMPONENTS
import Navbar from "./Components/Navbar";
import TemporaryDrawer from "./Drawer";

//SideTabs
import Tests from "./sidetabs/Tests";

//MUI
import AppBar from "@mui/material/AppBar";
import SideNav from "./Drawer";
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const App = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
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

  const handleGetOtpClick = async (req, res) => {
    try {
      res = await axios.post("http://127.0.0.1:5000/login", {
        mobile_number: mobileNumber,
      });
      console.log(res.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (req, res) => {
    req.preventDefault();
    try {
      res = await axios.post("http://127.0.0.1:5000/verify_otp", {
        otp: otp,
      });
      console.log(res);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginTop: 60 }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        color="transparent"
      >
        <Navbar />
      </AppBar>
      <div className="d-flex">
        <div
          className={`${short} grid-item`}
          style={{ borderRight: `1px solid #EEEEEE` }}
        >
          <SideNav show={toggle} />
          {/* <button onClick={chnageShort}>ABC</button> */}
          <IconButton onClick={chnageShort}>
            {toggle ? (
              <KeyboardDoubleArrowLeftIcon />
            ) : (
              <KeyboardDoubleArrowRightIcon />
            )}
          </IconButton>
        </div>
        <div className={`${long}`}>
          {/* right */}
          <Tests />

          {/* <Form onSubmit={handleSubmit}>
            <Form.Group controlId="websiteIp">
              <Form.Label>Website IP</Form.Label>
              <Form.Control type="text" placeholder="Enter Website IP" />
            </Form.Group>

            <Form.Group controlId="mobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Button variant="primary" onClick={handleGetOtpClick}>
              Get OTP
            </Button>

            <>
              <Form.Group controlId="otp">
                <Form.Label>Enter OTP</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                  }}
                  required
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSubmit} type="submit">
                Submit
              </Button>
            </>
          </Form> */}
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

//COMPONENTS

//SideTabs
import Tests from "./sidetabs/Tests";

//MUI

import SideNav from "./Drawer";
import { IconButton } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Route, Routes } from "react-router-dom";

const Home = () => {
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
    <div>
      <div className="d-flex">
        {/* <SideNav /> */}
        <div>{/* <button onClick={chnageShort}>ABC</button> */}</div>
        <div className={`col-lg-10`}>
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

export default Home;

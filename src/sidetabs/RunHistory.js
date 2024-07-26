import { useState } from "react";
import SideNav from "../Drawer";
import axios from "axios";
import { Button } from "@mui/material";

const RunHistory = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleGetOtpClick = async (req, res) => {
    try {
      res = await axios.post("http://127.0.0.1:8000/api/enter-mobile-number/", {
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
      res = await axios.post(
        "http://127.0.0.1:8000/api/enter-otp-and-verify/",
        {
          otp: otp,
        }
      );
      console.log(res);
      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex" style={{ marginTop: "50px" }}>
      <SideNav />
      <h1>RunHistory</h1>
      <div onSubmit={handleSubmit}>
        <label>Website IP</label>
        <input type="text" placeholder="Enter Website IP" />

        <label>Mobile Number</label>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value);
          }}
          required
        />

        <Button variant="primary" onClick={handleGetOtpClick}>
          Get OTP
        </Button>

        <label>Enter OTP</label>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
          required
        />
        <Button variant="primary" onClick={handleSubmit} type="submit">
          Submit
        </Button>
      </div>
    </div>
  );
};
export default RunHistory;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Tests from "./sidetabs/Tests";
import Alerts from "./sidetabs/Alerts";
import Projects from "./Projects";
import SideNav from "./Drawer";
import Suites from "./sidetabs/Suites";
import RunHistory from "./sidetabs/RunHistory";
import Schedules from "./sidetabs/Schedules";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Projects />}></Route>

      <Route path="/test" element={<Tests />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/suites" element={<Suites />} />
      <Route path="/run-history" element={<RunHistory />} />
      <Route path="/schedules" element={<Schedules />} />
    </Routes>
  );
};

export default App;

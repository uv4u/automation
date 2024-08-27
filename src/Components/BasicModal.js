import * as React from "react";
import "../styles.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 450,
  bgcolor: "background.paper",
  border: "2px solid #f1f1f1",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");

  var cod = "";
  const handleState = () => {};

  function convertPyToJson(pyScript) {
    const lines = pyScript.split("\n");
    const jsonData = {
      content: lines,
    };
    const jsonString = JSON.stringify(jsonData, null, 2);
    console.log(jsonString);
    return jsonString;
  }

  function changeScript(code) {
    // cod = convertPyToJson(cod);
    setCode(convertPyToJson(code));
  }

  const handleSave = async () => {
    console.log(cod);
    changeScript(cod);
    const response = await axios.post("http://127.0.0.1:8000/api/savecode/", {
      name: name,
      code: code,
    });
    if (response.statusText === "OK") {
      window.location.reload();
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Add Test
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 10000,
          },
        }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "700" }}
          >
            Add new test
          </Typography>
          {/* <Typography
            id="modal-modal-description"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Name:
          </Typography> */}
          <div className="d-flex flex-column " style={{ gap: "16px" }}>
            {/* <input
              type="text"
              className="shadow rounded"
              style={{ border: 1, height: "30px" }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            /> */}
            <TextField
              id="standard-basic"
              className="shadow rounded"
              label="Name"
              sx={{ border: 0 }}
              placeholder="e.g. Login"
              variant="standard"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <TextField
              id="outlined-multiline-static"
              className="shadow rounded"
              label="Code"
              sx={{ border: 0 }}
              multiline
              rows={7}
              // defaultValue="///"
              placeholder="Type your code..."
              fullWidth
              onChange={(e) => {
                // cod = e.target.value;
                setCode(e.target.value);
              }}
            />
          </div>
          <div className="d-flex" style={{ paddingTop: "10px", gap: "10px" }}>
            <div>
              <Button
                variant="outlined"
                onClick={() => {
                  handleSave();
                  handleClose();
                }}
              >
                Save
              </Button>
            </div>
            <div>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

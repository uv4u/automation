import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { X } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");

  var a = "";
  var cod = "";

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
            timeout: 500,
          },
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Test
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Name:
          </Typography>
          <div className="d-flex flex-column" style={{ gap: "16px" }}>
            <input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <TextField
              id="outlined-multiline-static"
              label="Code"
              multiline
              rows={4}
              defaultValue="///"
              fullWidth
              onChange={(e) => {
                // cod = e.target.value;
                setCode(e.target.value);
              }}
            />
          </div>
          <Button
            onClick={() => {
              // if (a !== "") {
              //   console.log(a);
              //   props.setState([...props.state, a]);
              //   console.log(props.state.length);

              handleSave();
              handleClose();
              // } else {
              // alert("Please enter a name");
              // }
            }}
          >
            Save
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}

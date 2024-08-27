import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import axios from "axios";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";

const TextEditor = ({ fileName, onClose }) => {
  const [content, setContent] = useState(""); // State to hold file content
  const [loading, setLoading] = useState(true); // State for loading status
  const [saving, setSaving] = useState(false); // State for saving status

  // Fetch file content when fileName changes
  useEffect(() => {
    const fetchFileContent = async () => {
      //   console.log("here");
      console.log(fileName);
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/get-file-content/`,
          { filename: fileName }
        );
        console.log(response);
        setContent(response.data.content);

        // console.log(response.data.content);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching file content:", error);
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [fileName]);

  // Handle saving file content
  const handleSave = async () => {
    setSaving(true);
    console.log(`filename=${fileName} content=${content}`);
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/save-file-content/`,
        {
          filename: fileName,
          content: content,
        }
      );
      console.log(res);
      setSaving(false);
      // alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file content:", error);
      setSaving(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ margin: "1rem" }}>
      {/* <ReactQuill value={content} onChange={setContent} /> */}
      <TextField
        id="outlined-multiline-static"
        label="Code"
        sx={{ border: 0, width: 750 }}
        multiline
        rows={7}
        // defaultValue="///"
        placeholder="Type your code..."
        width={150}
        value={content}
        onChange={(e) => {
          // cod = e.target.value;

          setContent(e.target.value);
        }}
      />
      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleSave();
            onClose();
          }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          style={{ marginLeft: "1rem" }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;

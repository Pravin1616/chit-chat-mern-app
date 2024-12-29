import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToast } from "../../context/ToastProvider";

const Signup = ({ toggleSignUp }) => {
  const [show, setShow] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowPassword = () => setShow(!show);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const { addToast } = useToast();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      addToast("Please fill all the fields.", "warning");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      addToast("Passwords do not match.", "warning");
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      addToast("Registration successful!", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(
        `Error occurred: ${error.response?.data?.message || "Unknown error"}`
      );
      addToast("Unknown error", "warning");
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (!pics) {
      addToast("Please select an image.", "warning");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append(
        "upload_preset",
        `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`
      );
      data.append(
        "cloud_name",
        `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`
      );
      fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          addToast("Error uploading the image.", "warning");
          setPicLoading(false);
        });
    } else {
      addToast("Select a valid image", "warning");
      setPicLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <Form style={{ width: "100%", maxWidth: "400px" }}>
        <div>
          <h2>Sign Up!</h2>
          <h2>Create an account</h2>
          <p className="mt-3">Be part of us and explore chat?</p>
        </div>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              className="pe-5"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={handleShowPassword}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "#007bff",
              }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </div>
        </Form.Group>

        <Form.Group controlId="confirmpassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              className="pe-5"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={handleShowConfirmPassword}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "#007bff",
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </Form.Group>

        <Form.Group controlId="pic" className="mb-3">
          <Form.Label>Upload Your Picture</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </Form.Group>

        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={submitHandler}
          disabled={picLoading}
        >
          {picLoading ? "Signing up..." : "Sign Up"}
        </Button>
        <div className="text-center mt-3">
          <p>
            Already have an account? <span onClick={toggleSignUp}>Log in</span>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Signup;

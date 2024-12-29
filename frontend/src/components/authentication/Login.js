import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from "../../context/ToastProvider";

const Login = ({ toggleSignUp }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const history = useHistory();
  const { setUser } = ChatState();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      addToast("Login Successful", "success");
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      alert(`Error Occurred: ${error.response.data.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <Form style={{ width: "100%", maxWidth: "400px" }}>
        <div>
          <h2>Welcome Back!</h2>
          <h2>Login to your account</h2>
          <p className="mt-3">It's nice to see you again. Ready to chat?</p>
        </div>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              className="pe-5"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
            <button
              type="button"
              onClick={handleClick}
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
            </button>
          </div>
        </Form.Group>

        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={submitHandler}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Button
          variant="danger"
          className="w-100"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>

        <div className="text-center mt-3">
          <p>
            Don't have an account? <span onClick={toggleSignUp}>Sign up</span>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;

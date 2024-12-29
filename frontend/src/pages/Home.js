import React, { useState } from "react";
import Login from "../components/authentication/Login";
import { Row, Col } from "react-bootstrap";
import Signup from "../components/authentication/Signup";

function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const toggleSignUp = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <Row className="min-vh-100 m-0">
      {/* 9-column Banner Section */}
      <Col
        md={8}
        className="d-flex align-items-center justify-content-center bg-primary text-white"
      >
        <div className="">
          <h3>Welcome to</h3>
          <h1>ChitChat</h1>
          <h4 className="mt-3">
            A new way to connect and chat with your friends.
          </h4>
        </div>
      </Col>

      {/* 3-column Authentication Section */}
      <Col md={4} className="bg-light p-4">
        {isSignUpMode ? (
          <Signup toggleSignUp={toggleSignUp} />
        ) : (
          <Login toggleSignUp={toggleSignUp} />
        )}
      </Col>
    </Row>
  );
}

export default Home;

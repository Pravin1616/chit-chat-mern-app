import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { ChatState } from "../../context/ChatProvider";

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Card
      onClick={handleFunction}
      style={{
        backgroundColor: "#E8E8E8",
        cursor: "pointer",
        borderRadius: "8px",
        marginBottom: "8px",
        padding: "10px",
      }}
      className="d-flex align-items-center"
    >
      <Row>
        <Col xs={2} className="d-flex justify-content-center">
          <div style={{ position: "relative" }}>
            {user.pic ? (
              <img
                src={user.pic}
                alt={user.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <PersonCircle size={40} />
            )}
          </div>
        </Col>
        <Col xs={10}>
          <div>
            <h6 style={{ margin: 0, fontSize: "16px" }}>{user.name}</h6>
            <small style={{ fontSize: "12px", color: "#777" }}>
              <b>Email:</b> {user.email}
            </small>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default UserListItem;

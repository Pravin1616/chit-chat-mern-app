import React, { useState } from "react";
import { Modal, Button, Image } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";

const ProfileModal = ({ user, children }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {children ? (
        <span onClick={handleShow} style={{ cursor: "pointer" }}>
          {children}
        </span>
      ) : (
        <Button variant="link" onClick={handleShow}>
          <Eye size={24} />
        </Button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        aria-labelledby="profile-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="profile-modal-title"
            style={{
              fontSize: "40px",
              fontFamily: "Work Sans",
              textAlign: "center",
              width: "100%",
            }}
          >
            {user.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="d-flex flex-column align-items-center justify-content-between"
          style={{ height: "350px" }}
        >
          <Image
            roundedCircle
            src={user.pic}
            alt={user.name}
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <p
            style={{
              fontSize: "28px",
              fontFamily: "Work Sans",
              marginTop: "20px",
            }}
          >
            Email: {user.email}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;

import React from "react";
import { Badge, Button } from "react-bootstrap";
import { X } from "react-bootstrap-icons";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      pill
      bg="primary"
      className="m-1 mb-2 d-inline-flex align-items-center cursor-pointer"
      onClick={handleFunction}
      style={{ fontSize: "12px" }}
    >
      {user.name}
      {admin === user._id && <span className="ms-1">(Admin)</span>}
      <Button
        variant="light"
        size="sm"
        className="d-flex align-items-center ms-2 p-0"
        onClick={(e) => {
          e.stopPropagation();
          handleFunction();
        }}
      >
        <X />
      </Button>
    </Badge>
  );
};

export default UserBadgeItem;

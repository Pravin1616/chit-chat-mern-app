import React from "react";
import { Card } from "react-bootstrap";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  return (
    <Card className="h-100">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Card>
  );
};

export default Chatbox;

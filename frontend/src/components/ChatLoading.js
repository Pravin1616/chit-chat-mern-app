import React from "react";
import { Stack } from "react-bootstrap";
import { Placeholder } from "react-bootstrap";

const ChatLoading = () => {
  return (
    <Stack gap={2} className="p-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <Placeholder key={index} as="div" animation="wave" className="my-1">
          <Placeholder
            xs={12}
            style={{ height: "65px", borderRadius: "5px" }}
          />
        </Placeholder>
      ))}
    </Stack>
  );
};

export default ChatLoading;

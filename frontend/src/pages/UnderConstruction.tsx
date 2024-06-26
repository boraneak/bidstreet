import React from "react";
const UnderConstruction: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h3 style={{ fontWeight: "normal" }}>{message}</h3>
    </div>
  );
};

export default UnderConstruction;

import React, { useState } from "react";

const RoomLayoutCanvas = () => {
  const [roomDimensions, setRoomDimensions] = useState({
    width: 500,
    height: 500,
  });
  const [wallColor, setWallColor] = useState("#ffffff");

  return (
    <div
      className="room-canvas"
      style={{
        width: roomDimensions.width,
        height: roomDimensions.height,
        backgroundColor: wallColor,
      }}
    >
      <canvas id="main-room-layout" />
    </div>
  );
};

export default RoomLayoutCanvas;

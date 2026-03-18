import React, { useState } from "react";

const FurnitureViewer3D = ({ objectId }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState(0);

  const updatePosition = (axis, value) => {
    setPosition((prev) => ({ ...prev, [axis]: value }));
  };

  const rotateObject = (degrees) => {
    setRotation((prev) => prev + degrees);
  };

  return (
    <div className="viewer-3d">
      <canvas id={`model-${objectId}`} />
    </div>
  );
};

export default FurnitureViewer3D;

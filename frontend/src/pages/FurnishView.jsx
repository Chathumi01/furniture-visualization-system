import { useState } from "react";
import RoomEditor    from "./RoomEditor";
import RoomViewer3D  from "./RoomViewer3D";

/**
 * Comforta — top-level wrapper
 *
 * Drop this into your router as the page component, e.g.:
 *   <Route path="/editor" element={<Comforta />} />
 *
 * Or just render <Comforta /> directly in App.jsx
 */
export default function Comforta() {
  const [view,  setView]  = useState("2d");   // "2d" | "3d"
  const [items, setItems] = useState([]);
  const [room,  setRoom]  = useState({
    w: 5, d: 4, shape: "rect",
    wallColor: "#F5F0E8", floorColor: "#C8A97A",
  });

  if (view === "3d") {
    return (
      <RoomViewer3D
        items={items}
        room={room}
        onBackTo2D={() => setView("2d")}
      />
    );
  }

  return (
    <RoomEditor
      onSwitch3D={(liveItems, liveRoom) => {
        setItems(liveItems);
        setRoom(liveRoom);
        setView("3d");
      }}
    />
  );
}

import { useContext } from "react";
import { RoomContext } from "../contexts/RoomContext";

function CreateButton() {
  const { ws } = useContext(RoomContext);
  const createRoom = () => {
    ws.emit("create-room", () => {
      console.log("user join room");
    });
  };
  return (
    <button
      className="bg-red-200 border border-green-200 p-2"
      onClick={createRoom}
    >
      start new meeting
    </button>
  );
}

export default CreateButton;

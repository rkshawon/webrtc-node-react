import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

interface IRoomParams {
  roomId: string;
  peerId: string;
}

const rooms: Record<string, string[]> = {};
const roomSet = new Set();

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("user created new room");
  };

  const joinRoom = ({ roomId, peerId }: IRoomParams) => {
    if (rooms[roomId]) {
      if (!roomSet.has(peerId)) {
        roomSet.add(peerId);
        rooms[roomId].push(peerId);
      }
      console.log("user join room with this id", rooms, roomSet);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", { peerId });
      socket.emit("get-users", { roomId, participants: rooms[roomId] });
    }
    socket.on("disconnect", () => {
      console.log("user left", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};

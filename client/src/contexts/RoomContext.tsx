import Peer from "peerjs";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { v4 as uuid } from "uuid";
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8000";

interface RoomProviderProps {
  children: ReactNode;
}
const ws = socketIOClient(WS);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RoomContext = createContext<null | any>(null);

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate("/room/" + roomId);
  };

  const allUsers = ({ participants }: { participants: string[] }) => {
    console.log(participants);
  };
  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  useEffect(() => {
    const ownId = uuid();
    const peer = new Peer(ownId);
    setUser(peer);

    try {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error("Error initializing room:", error);
    }
    ws.on("get-users", allUsers);
    ws.on("room-created", enterRoom);
    ws.on("user-disconnected", removePeer);
  }, []);

  useEffect(() => {
    if (!user || !stream) {
      return;
    }
    ws.on("user-join", ({ peerId }) => {
      const call = user.call(peerId, stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [user, stream]);

  return (
    <RoomContext.Provider value={{ ws, user, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../contexts/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../contexts/peerReducer";

function Room() {
  const { id } = useParams();
  const { ws, user, stream, peers } = useContext(RoomContext);

  useEffect(() => {
    if (user) ws.emit("join-room", { roomId: id, peerId: user._id });
  }, [id, ws, user]);

  return (
    <div>
      <div>
        <VideoPlayer stream={stream} />
        {Object.values(peers as PeerState).map((peers) => (
          <VideoPlayer stream={peers.stream} />
        ))}
      </div>
      <div>
        <button>Share screen</button>
      </div>
    </div>
  );
}

export default Room;

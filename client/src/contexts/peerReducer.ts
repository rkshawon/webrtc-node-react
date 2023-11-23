import { ADD_PEER, REMOVE_PEER } from "./peerActions";

export type PeerState = Record<string, { stream: MediaStream }>;
type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };
export const peersReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER: {
      const { payload } = action;
      return {
        ...state,
        [payload.peerId]: {
          stream: payload.stream,
        },
      };
    }
    case REMOVE_PEER: {
      const { payload } = action;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [payload.peerId]: deleted, ...rest } = state;
      return rest;
    }
    default:
      return { ...state };
  }
};

import React, { useEffect } from "react";

import css from "./style.module.css";
import VideoChat from "./VideoChat";

const Main = ({
  userState,
  conference,
  socketController,
  toggleMicrophone,
  toggleVideo,
  webRtcPeers,
  audioOutput,
}) => {
  useEffect(() => {
    socketController.on("message", (data) => {
      const message = data.message;
      switch (message.id) {
        case "startStreamResponse":
          console.log("startStreamResponse --- ", message);
          conference.startStreamResponse(message);
          break;
        case "startViewResponse":
          console.log("startViewResponse --- ", message);
          conference.startViewResponse(message);
          break;
        case "videoChat:published":
          console.log("videochat:published --- ", message);
          conference.addView(message);
          break;
        case "iceCandidate":
          webRtcPeers
            .getPeer(message.viewPeer)
            .addIceCandidate(message.candidate);
          break;
        case "stopCommunication":
          conference.dispose(message.userId);
          break;
        default:
          console.log("Unrecognized message", message);
      }
    });
    conference.startStream();
  }, []);

  return (
    <div className={css.mainBox}>
      <VideoChat
        membersToView={userState.membersToView}
        ownerId={userState.userId}
        toggleMicrophone={toggleMicrophone}
        toggleVideo={toggleVideo}
        webRtcPeers={webRtcPeers}
        audioOutput={audioOutput}
      />
    </div>
  );
};

export default Main;

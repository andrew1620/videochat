import React from "react";

import css from "./style.module.css";
import UserVideo from "./UserVideo";

const VideoChat = ({
  membersToView,
  ownerId,
  toggleMicrophone,
  toggleVideo,
  webRtcPeers,
  audioOutput,
}) => {
  if (!membersToView) return <div className={css.videoChat}></div>;

  console.log("membersToView --- ", membersToView);

  const findUserStream = (userId) => {
    const webRtcPeer = webRtcPeers.getPeer(userId);
    if (!webRtcPeer)
      return console.log("Такого пира нет в webRtcPeers: ", userId);

    if (userId === ownerId) {
      return webRtcPeer.getLocalStream();
    }
    return webRtcPeer.getRemoteStream();
  };

  const usersToView = membersToView.map((u) => {
    if (!u.id) return null;
    return (
      <UserVideo
        key={u.id}
        stream={findUserStream(u.id)}
        mute={u.id === ownerId}
        toggleMicrophone={toggleMicrophone}
        toggleVideo={toggleVideo}
        hasVideoControl={u.id === ownerId}
        microphoneMute={u.microphoneMute}
        videoStop={u.videoStop}
        audioOutput={audioOutput}
      />
    );
  });

  return <div className={css.videoChat}>{usersToView}</div>;
};

export default VideoChat;

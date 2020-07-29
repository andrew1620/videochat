import React, { useEffect } from "react";

import css from "./style.module.css";
import VideoControl from "./VideoControl";
import { AudioMutedOutlined, UserOutlined } from "@ant-design/icons";

const UserVideo = ({
  stream,
  mute,
  toggleMicrophone,
  hasVideoControl,
  toggleVideo,
  microphoneMute = false,
  videoStop = false,
  audioOutput,
}) => {
  const videoRef = React.useRef();

  useEffect(() => {
    videoRef.current.srcObject = stream;
    if (audioOutput && videoRef.current.setSinkId)
      videoRef.current.setSinkId(audioOutput);
  }, [stream]);

  return (
    <div className={css.userVideo}>
      {microphoneMute && <AudioMutedOutlined className={css.mute} />}
      {videoStop && (
        <span className={css.videoStop}>
          <UserOutlined className={css.videoPic} />
        </span>
      )}
      <video
        ref={videoRef}
        autoPlay
        width="100%"
        height="100%"
        muted={mute}
        className={css.video}
      ></video>
      {hasVideoControl && (
        <VideoControl
          toggleMicrophone={toggleMicrophone}
          toggleVideo={toggleVideo}
        />
      )}
    </div>
  );
};

export default UserVideo;

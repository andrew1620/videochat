import React from "react";

import css from "./style.module.css";
import { Button } from "antd";
import { VideoCameraOutlined, AudioOutlined } from "@ant-design/icons";

const VideoControl = ({ toggleMicrophone, toggleVideo }) => {
  const [isMicroClicked, setIsMicroClicked] = React.useState(true);
  const [isVideoClicked, setIsVideoClicked] = React.useState(true);

  const handleVideoClick = () => {
    toggleVideo();
    setIsVideoClicked(!isVideoClicked);
  };
  const handleMicrophoneClick = () => {
    toggleMicrophone();
    setIsMicroClicked(!isMicroClicked);
  };

  return (
    <div className={css.videoControl}>
      <Button
        danger={isVideoClicked}
        type="primary"
        shape="circle"
        icon={<VideoCameraOutlined />}
        onClick={handleVideoClick}
      ></Button>
      <Button
        danger={isMicroClicked}
        type="primary"
        shape="circle"
        icon={<AudioOutlined />}
        onClick={handleMicrophoneClick}
      ></Button>
    </div>
  );
};

export default VideoControl;

import React from "react";

import Main from "./index";
import conference from "./conference";
import { socketController } from "../../API/socketConnection";
import { updateMemberToView } from "../../reducers/user";
import webRtcPeers from "./webRtcPeers";
import { Spin } from "antd";
import css from "./style.module.css";

const MainContainer = (props) => {
  const [areUsersLoaded, setAreUsersLoaded] = React.useState(false);

  React.useEffect(() => {
    socketController.connect();
  }, []);
  React.useEffect(() => {
    if (props.userState.isConnected) {
      socketController.emit("addSocketId", { userId: props.userState.userId });
      socketController.emit("getUsers", null, (response) => {
        conference.setUsersToView(response.users);
        setAreUsersLoaded(true);
      });
      socketController.on("user:mute", (data) => {
        props.userDispatch(
          updateMemberToView(data.userId, { microphoneMute: data.muted })
        );
      });
      socketController.on("user:videoStop", (data) => {
        props.userDispatch(
          updateMemberToView(data.userId, { videoStop: data.videoStop })
        );
      });
    }
    conference.setUserId(props.userState.userId);
  }, [props.userState.isConnected]);

  return areUsersLoaded ? (
    <Main
      {...props}
      conference={conference}
      socketController={socketController}
      toggleMicrophone={conference.toggleMicrophone}
      toggleVideo={conference.toggleVideo}
      webRtcPeers={webRtcPeers}
    />
  ) : (
    <Spin className={css.spinner} tip="Connecting to server" />
  );
};

export default MainContainer;

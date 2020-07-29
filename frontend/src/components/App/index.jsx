import React, { useReducer, useEffect } from "react";

import css from "./style.module.css";
import Auth from "../Auth";
import userReducer, {
  userReducerInitialState,
  setIsConnected,
} from "../../reducers/user";
import AppContext from "../../AppContext";
import appReducer, { appReducerInitialState } from "../../reducers/app";
import socket from "../../API/socketConnection";
import conference from "../Main/conference";
import MainContainer from "../Main/MainContainer";
import CheckDevices from "../CheckDevices";

export let _userDispatch;
export let _userState;
const App = () => {
  const [userState, userDispatch] = useReducer(
    userReducer,
    userReducerInitialState
  );
  _userDispatch = userDispatch;
  _userState = userState;
  const [appState, appDispatch] = useReducer(
    appReducer,
    appReducerInitialState
  );
  useEffect(() => {
    socket.on("connect", () => {
      userDispatch(setIsConnected(true));
    });
    socket.on("disconnect", () => {
      conference.stop();
    });
  }, []);

  const [audioOutput, setAudioOutput] = React.useState(null);
  const [areDevicesChecked, setAreDevicesChecked] = React.useState(false);

  return (
    <AppContext.Provider
      value={{ userState, userDispatch, appState, appDispatch }}
    >
      <div className={css.appBox}>
        {!areDevicesChecked && (
          <CheckDevices
            setAreDevicesChecked={setAreDevicesChecked}
            setAudioOutput={setAudioOutput}
          />
        )}
        {!userState.userId && areDevicesChecked && <Auth />}
        {userState.userId && (
          <MainContainer
            isConnected={userState.isConnected}
            userState={userState}
            userDispatch={userDispatch}
            audioOutput={audioOutput}
          />
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;

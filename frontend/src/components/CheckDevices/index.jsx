import React from "react";

import css from "./style.module.css";
import { Select, Alert, Button } from "antd";
import { useEffect } from "react";
import conference from "../Main/conference";

const CheckDevices = ({ setAreDevicesChecked, setAudioOutput }) => {
  const videoRef = React.useRef();

  const { Option } = Select;

  const [alert, setAlert] = React.useState({
    type: null,
    hasAlert: false,
    message: null,
  });
  const [devices, setDevices] = React.useState([]);
  const [constraints, setConstraints] = React.useState({
    audio: true,
    video: true,
  });

  const setLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      videoRef.current.srcObject = localStream;
    } catch (error) {
      console.log("localSteamError: ", error);
      setAlert({
        type: "error",
        hasAlert: true,
        message:
          "Невозможно получить видео с камеры. Возможно вы запретили доступ",
      });
      if (error.name === "OverconstrainedError") {
        setAlert({
          type: "warning",
          hasAlert: true,
          message:
            "Невозможно установить это устройство. Было выбрано устройство по умолчанию",
        });
      }
    }
  };
  const checkDevices = (devices) => {
    const alert = { type: "error", hasAlert: true, message: null };
    let audio = 0;
    let video = 0;
    let audioOut = 0;
    for (let i = 0; i < devices.length; i++) {
      if (devices[i].kind === "audioinput") audio++;
      if (devices[i].kind === "videoinput") video++;
      if (devices[i].kind === "audiooutput") audioOut++;
    }

    if (audio < 1) alert.message = "No microphone";
    else if (video < 1) alert.message = "No camera";
    else if (audioOut < 1) alert.message = "No audio output";

    if (alert.message || !devices) {
      setAlert(alert);
    }
  };

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      checkDevices(devices);
      setDevices(devices);
      console.log("devices --- ", devices);
    } catch (err) {
      console.log(err);
      setAlert({
        type: "error",
        hasAlert: true,
        message: "Невозможно получить данные об устройствах",
      });
    }
  };

  useEffect(() => {
    getDevices();
  }, []);
  useEffect(() => {
    setLocalStream();
  }, [constraints]);

  const btnContinue = () => {
    conference.setConstraints(constraints);
    setAreDevicesChecked(true);
  };

  const chooseMicro = (value) => {
    setConstraints({
      audio: { deviceId: value },
      video: constraints.video,
    });

    console.log(value);
  };
  const chooseCamera = (value) => {
    setConstraints({
      audio: constraints.audio,
      video: { deviceId: value },
    });

    console.log(value);
  };
  const chooseAudioOutput = async (value) => {
    console.log("earphones --- ", value);
    if (videoRef.current) {
      try {
        await videoRef.current.setSinkId(value);
        setAudioOutput(value);
        console.log("audio output successfuly set. ", value);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("No video element");
    }
  };

  const microphones = devices
    .filter((d) => d.kind === "audioinput" && d.deviceId !== "default")
    .map((d, i) => (
      <Option value={d.deviceId} key={i}>
        {d.label}
      </Option>
    ));
  const videoCams = devices
    .filter((d) => d.kind === "videoinput")
    .map((d, i) => (
      <Option value={d.deviceId} key={i}>
        {d.label}
      </Option>
    ));
  const audioOutputs = devices
    .filter((d) => d.kind === "audiooutput" && d.deviceId !== "default")
    .map((d, i) => (
      <Option value={d.deviceId} key={i}>
        {d.label}
      </Option>
    ));

  return (
    <div className={css.checkDevices}>
      {videoCams.length !== 0 && (
        <>
          <video ref={videoRef} autoPlay width="100%" height="200px"></video>
          <Select
            onChange={chooseCamera}
            className={css.microSelect}
            placeholder="Choose camera"
          >
            {videoCams}
          </Select>
        </>
      )}
      {microphones.length !== 0 && (
        <Select
          onChange={chooseMicro}
          className={css.microSelect}
          placeholder="Choose microphone"
        >
          {microphones}
        </Select>
      )}
      {audioOutputs.length !== 0 && (
        <Select
          onChange={chooseAudioOutput}
          className={css.microSelect}
          placeholder="Choose audio output"
        >
          {audioOutputs}
        </Select>
      )}
      <Button
        onClick={btnContinue}
        className={css.btnContinue}
        type="primary"
        disabled={alert.type === "error"}
      >
        Продолжить
      </Button>
      {alert.hasAlert && (
        <Alert
          message={alert.type}
          description={alert.message}
          type={alert.type}
          showIcon
          closable={alert.type === "warning"}
          afterClose={() => {
            setAlert({ type: null, hasAlert: false, message: null });
          }}
        />
      )}
    </div>
  );
};

export default CheckDevices;

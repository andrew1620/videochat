import { socketController } from "../../API/socketConnection";
import kurentoUtils from "kurento-utils";

import { _userDispatch } from "../App/index";
import {
  setMembersToView,
  deleteMemberToView,
  updateMemberToView,
} from "../../reducers/user";
import webRtcPeers from "./webRtcPeers";

class Conference {
  constructor() {
    this.userId = null;
    this.usersToView = null;
    this.constraints = { audio: true, video: true };
  }
  startStream = () => {
    const options = {
      onicecandidate: onIceCandidate.bind(this),
      configuration: {
        iceServers: [
          {
            urls: "turn:144.76.81.36:3478",
            username: "forasoft",
            credential: "ajhfcjanfqccthdth",
          },
          {
            urls: "stun:64.233.161.127:19302",
          },
        ],
      },
      mediaConstraints: this.constraints,
    };
    function onIceCandidate(candidate) {
      const message = {
        title: "startStream",
        id: "onIceCandidate",
        userId: this.userId,
        candidate: candidate,
      };
      socketController.sendMessage(message);
    }

    const onOffer = (error, sdpOffer) => {
      if (error) return console.log(error);

      var message = {
        id: "startStream",
        sdpOffer,
        userId: this.userId,
      };
      socketController.sendMessage(message);
    };

    const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
      options,
      function (error) {
        if (error) return console.log(error);

        this.generateOffer(onOffer);
      }
    );
    webRtcPeers.addPeer(this.userId, webRtcPeer);

    this.startView();
  };
  startStreamResponse = (message) => {
    if (message.response !== "accepted") {
      console.error("startStreamResponse is not accepted");
    } else {
      webRtcPeers
        .getPeer(this.userId)
        .processAnswer(message.sdpAnswer, (err) => {
          if (err)
            return console.log(
              "Error in startStreamResponse -> process answer:",
              err
            );
          _userDispatch(
            setMembersToView({
              id: message.viewPeer,
              videoStop: message.videoStop,
              muted: message.muted,
            })
          );
        });
      this.toggleVideo();
      this.toggleMicrophone();
    }
  };
  startView = () => {
    for (let userToViewId in this.usersToView) {
      if (userToViewId === this.userId) continue;

      const options = {
        onicecandidate: onIceCandidate.bind(this),
        configuration: {
          iceServers: [
            {
              urls: "turn:144.76.81.36:3478",
              username: "forasoft",
              credential: "ajhfcjanfqccthdth",
            },
            {
              urls: "stun:64.233.161.127:19302",
            },
          ],
        },
        mediaConstraints: this.constraints,
      };
      function onIceCandidate(candidate) {
        const message = {
          title: "startView",
          userToView: userToViewId,
          id: "onIceCandidate",
          userId: this.userId,
          candidate: candidate,
        };
        socketController.sendMessage(message);
      }
      const onOfferViewer = (error, sdpOffer) => {
        if (error) return console.log(error);

        const message = {
          id: "startView",
          sdpOffer,
          userId: this.userId,
          userToView: userToViewId,
        };
        socketController.sendMessage(message);
      };

      const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        function (error) {
          if (error) return console.log(error);

          this.generateOffer(onOfferViewer);
        }
      );
      webRtcPeers.addPeer(userToViewId, webRtcPeer);
    }
  };
  startViewResponse = (message) => {
    webRtcPeers
      .getPeer(message.viewPeer)
      .processAnswer(message.sdpAnswer, (err) => {
        if (err)
          console.log("Error in startViewResponse -> process answer:", err);
        // Нужно убрать и сделать по нормальному
        _userDispatch(
          setMembersToView({
            id: message.viewPeer,
            videoStop: message.videoStop,
          })
        );
      });
  };
  addView = (message) => {
    if (message.userId === this.userId)
      return console.log("Тот же пользователь");

    const options = {
      onicecandidate: onIceCandidate.bind(this),
      configuration: {
        iceServers: [
          {
            urls: "turn:144.76.81.36:3478",
            username: "forasoft",
            credential: "ajhfcjanfqccthdth",
          },
          {
            urls: "stun:64.233.161.127:19302",
          },
        ],
      },
      mediaConstraints: this.constraints,
    };
    function onIceCandidate(candidate) {
      const response = {
        title: "startView",
        userToView: message.userId,
        id: "onIceCandidate",
        userId: this.userId,
        candidate: candidate,
      };
      socketController.sendMessage(response);
    }
    const onOffer = (error, sdpOffer) => {
      if (error) return console.log("addView -> onOfferViewer: ", error);

      var response = {
        id: "startView",
        sdpOffer,
        userId: this.userId,
        userToView: message.userId,
      };
      socketController.sendMessage(response);
    };

    const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      function (error) {
        if (error) return console.log(error);

        this.generateOffer(onOffer);
      }
    );
    webRtcPeers.addPeer(message.userId, webRtcPeer);
  };
  dispose = (userId) => {
    socketController.sendMessage({ id: "stop", userId });

    webRtcPeers.getPeer(userId).dispose();
    webRtcPeers.deletePeer(userId);
    _userDispatch(deleteMemberToView(userId));
  };
  setUserId(userId) {
    console.log(this, " | ", userId);
    this.userId = userId;
  }
  setUsersToView(users) {
    this.usersToView = users;
  }
  setConstraints(constraints) {
    this.constraints = { ...constraints };
  }
  toggleMicrophone = () => {
    const webRtcPeer = webRtcPeers.getPeer(this.userId);
    const isMuted = webRtcPeer.getLocalStream().getAudioTracks()[0].enabled;
    webRtcPeer.getLocalStream().getAudioTracks()[0].enabled = !isMuted;

    socketController.emit("user:mute", {
      userId: this.userId,
      muted: isMuted,
    });
  };
  toggleVideo = () => {
    const webRtcPeer = webRtcPeers.getPeer(this.userId);
    const isVideoStoped = webRtcPeer.getLocalStream().getVideoTracks()[0]
      .enabled;
    webRtcPeer.getLocalStream().getVideoTracks()[0].enabled = !isVideoStoped;

    _userDispatch(
      updateMemberToView(this.userId, { videoStop: isVideoStoped })
    );

    socketController.emit("user:videoStop", {
      userId: this.userId,
      videoStop: isVideoStoped,
    });
  };
}

const conference = new Conference();
export default conference;

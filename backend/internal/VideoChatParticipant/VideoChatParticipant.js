const kurento = require("kurento-client");
const { users } = require("../../data/db/users");
const config = require("../../config");

class VideoChatParticipant {
  async publish(user, sdpOffer, socket, roomParticipant) {
    let publishEndpoint = await roomParticipant.getPublishEndpoint();
    if (!publishEndpoint) {
      publishEndpoint = await roomParticipant.createPublishEndpoint();
    }

    publishEndpoint.setTurnUrl(config.turnUrl);
    publishEndpoint.setStunServerAddress(config.stunIp);
    publishEndpoint.setStunServerPort(config.stunPort);

    this.onAddIceCandidates(publishEndpoint, user, roomParticipant);
    this.setIceCandidateEvent(publishEndpoint, socket, user.id);

    const sdpAnswer = await publishEndpoint.processOffer(sdpOffer);

    await publishEndpoint.gatherCandidates();

    return sdpAnswer;
  }
  async view(user, userToView, sdpOffer, socket, roomParticipant, room) {
    let endpoint = await roomParticipant.getViewEndpoint(userToView);
    if (!endpoint) {
      endpoint = await roomParticipant.createViewEndpoint(userToView);
    }

    endpoint.setTurnUrl(config.turnUrl);
    endpoint.setStunServerAddress(config.stunIp);
    endpoint.setStunServerPort(config.stunPort);

    this.onAddIceCandidates(endpoint, user, roomParticipant);
    this.setIceCandidateEvent(endpoint, socket, userToView);

    const sdpAnswer = await endpoint.processOffer(sdpOffer);
    await room.connectEndpoint(userToView, endpoint);
    await endpoint.gatherCandidates();

    return sdpAnswer;
  }
  onIceCandidate(_candidate, userId, title, userToView, roomParticipant) {
    const candidate = kurento.getComplexType("IceCandidate")(_candidate);
    const publishEndpoint = roomParticipant.getPublishEndpoint();
    const viewEndpoint = roomParticipant.getViewEndpoint(userToView);
    const _user = users.getUser(userId);

    if (title === "startStream") {
      if (publishEndpoint) {
        return publishEndpoint.addIceCandidate(candidate);
      }
    } else if (title === "startView") {
      if (viewEndpoint && viewEndpoint.endpoint) {
        return viewEndpoint.endpoint.addIceCandidate(candidate);
      }
    }
    roomParticipant.addCandidateToQueue(_user.id, candidate);
  }
  stopCommunication(userId, socket, roomParticipant) {
    if (!userId) {
      userId = users.getBySocket(socket.id).id;
    }
    const viewEndpoint = roomParticipant.getViewEndpoint(userId);
    if (viewEndpoint) {
      viewEndpoint.release();
      // console.log("release viewEndpoint --- ", userId);
      roomParticipant.deleteViewEndpoint(userId);
      return userId;
    }
    const viewEndpointsToDelete = roomParticipant.getViewEndpoints();
    for (let userId in viewEndpointsToDelete) {
      viewEndpointsToDelete[userId].endpoint.release();
      roomParticipant.deleteViewEndpoint(userId);
    }

    const publishEndpoint = roomParticipant.getPublishEndpoint();
    if (publishEndpoint) {
      publishEndpoint.release();
      // console.log("release publishEndpoint --- ", userId);
    }
    users.deleteUser(userId);
    return userId;
  }
  onAddIceCandidates(endpoint, user, roomParticipant) {
    const candidatesQueue = roomParticipant.getCandidatesQueue(user.id);
    if (candidatesQueue) {
      candidatesQueue.forEach((candidate) => {
        endpoint.addIceCandidate(candidate);
      });
      roomParticipant.clearCandidatesQueue(user.id);
    }
  }
  setIceCandidateEvent(endpoint, socket, viewPeer) {
    endpoint.on("OnIceCandidate", function (event) {
      const candidate = kurento.getComplexType("IceCandidate")(event.candidate);

      socket.emit("message", {
        message: {
          id: "iceCandidate",
          viewPeer,
          candidate,
        },
      });
    });
  }
}

module.exports = VideoChatParticipant;
